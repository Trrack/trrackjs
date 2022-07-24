import { ActionNode, Graph, IRootNode, IStateNode, RootNode, StateLike } from '../graph';
import { TrrackAction } from './action';

export class ProvenanceGraph<TState> {
    current: IRootNode<TState> | IStateNode<TState>;
    readonly backend: Graph = new Graph();

    constructor(initialState: TState) {
        this.backend.addNode(
            new RootNode({
                type: 'state',
                val: initialState,
            })
        );
        this.current = this.root;
    }

    get root(): IRootNode<TState> {
        const root = this.backend.root;

        if (!root) throw new Error('No root node in provenance graph.');

        return root;
    }

    addAction(label: string, action: TrrackAction, state?: StateLike<TState>) {
        const actionNode = new ActionNode({
            label,
            action,
            hasSideEffects: true,
            triggeredBy: this.current,
        });
        const newStateNode = actionNode.result;
        const inverseNode = actionNode.inverseAction;

        this.backend.addNode(actionNode);
        this.backend.addNode(newStateNode);
        this.backend.addNode(inverseNode);
    }

    addState(label: string, stateLike: StateLike<TState>) {
        const actionNode = new ActionNode({
            label,
            action: {
                do: { name: '', args: [] },
                undo: { name: '', args: [] },
            },
            hasSideEffects: false,
            triggeredBy: this.current,
        });
        const newStateNode = actionNode.result;
        const inverseNode = actionNode.inverseAction;

        this.backend.addNode(actionNode);
        this.backend.addNode(newStateNode);
        this.backend.addNode(inverseNode);
    }

    goTo(node: IStateNode<TState>): IStateNode<TState>[] {
        this.changeCurrent(node);
        return [];
    }

    private changeCurrent(node: IStateNode<TState>) {
        this.current = node;
    }
}
