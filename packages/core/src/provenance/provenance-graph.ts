import { ActionNode, EdgeType, Graph, IGraph, IGraphNode, IStateNode, StateLike, StateNode } from '../graph';
import { TrrackAction } from './action';
import { IProvenanceGraph } from './type';

export class ProvenanceGraph<TState> implements IProvenanceGraph<TState> {
    static create<TState>(initialState: TState): IProvenanceGraph<TState> {
        return new ProvenanceGraph<TState>(initialState);
    }

    current: IStateNode<TState>;
    readonly backend: IGraph = Graph.create();

    constructor(initialState: TState) {
        this.addNode(
            StateNode.create('Start', {
                type: 'state',
                val: initialState,
            })
        );
        this.current = this.root;
    }

    private verifyAndGetRoot() {
        const stateNodes = this.backend.nodesBy<IStateNode<TState>>((n) => {
            return (
                n.type === 'State' &&
                n.incoming.length === 0 &&
                n.label === 'Start'
            );
        });

        return stateNodes.length === 1 ? stateNodes[0] : stateNodes.length;
    }

    get root(): IStateNode<TState> {
        const stateNode = this.verifyAndGetRoot();

        if (typeof stateNode === 'number') {
            throw new Error(
                stateNode === 0
                    ? 'No root node found. Incorrect provenance initialization.'
                    : 'Too many root nodes found. Invalid provenance graph.'
            );
        }

        return stateNode;
    }

    addAction(label: string, action: TrrackAction, state?: StateLike<TState>) {
        this.current.state.then((currentState) => {
            const actionNode = this.addNode(
                ActionNode.create(`Do: ${label}`, action.do, true, false) // Create action node
            );
            this.addEdge(this.current, actionNode, 'next'); // connect current state node to action node

            const newStateNode = this.addNode(
                StateNode.create<TState>(label, state ? state : currentState)
            ); // Create new statenode
            this.addEdge(actionNode, newStateNode, 'results_in'); // Connect action to newState node

            const inverseActionNode = this.addNode(
                ActionNode.create(`Undo: ${label}`, action.undo, true, true) // Create inverse action node
            );
            this.addEdge(actionNode, inverseActionNode, 'inverted_by'); // connect action to inverse
            this.addEdge(inverseActionNode, actionNode, 'inverts'); // connect inverse to action

            this.addEdge(newStateNode, inverseActionNode, 'previous'); // connect newstate to inverse
            this.addEdge(inverseActionNode, this.current, 'results_in'); // connect inverse to current state

            this.changeCurrent(newStateNode); // update current state to new state
        });
    }

    addState(label: string, stateLike: StateLike<TState>) {
        this.addAction(
            label,
            {
                do: { name: '', args: [] },
                undo: { name: '', args: [] },
            },
            stateLike
        );
    }

    goTo(node: IStateNode<TState>): IStateNode<TState>[] {
        this.changeCurrent(node);
        return [];
    }

    private changeCurrent(node: IStateNode<TState>) {
        this.current = node;
    }

    private addNode<T extends IGraphNode>(node: T): T {
        return this.backend.addNode(node);
    }

    private addEdge(source: IGraphNode, target: IGraphNode, type: EdgeType) {
        return this.backend.addEdge(source, target, type);
    }
}
