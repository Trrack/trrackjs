import { AProvenanceNode } from './abstract_graph_node';
import { IActionNode, IInverseActionNode, IRootNode, IStateNode, StateLike } from './types';

abstract class AStateNode<TState>
    extends AProvenanceNode
    implements IRootNode<TState>
{
    abstract get level(): number;

    private childActionMap: Map<string, IActionNode<TState>> = new Map();

    readonly state: PromiseLike<StateLike<TState>>;

    constructor(label: string, state: StateLike<TState>) {
        super(label);
        this.state = Promise.resolve(state);
    }

    actionToChild(child: IStateNode<TState>): IActionNode<TState> {
        const action = this.childActionMap.get(child.id);
        if (!action)
            throw new Error(`No action to go to ${child.label} (${child.id})`);

        return action;
    }

    addChildNode(child: IStateNode<TState>, action: IActionNode<TState>): void {
        if (this.childActionMap.has(child.id))
            throw new Error('This child is already registered!');
        this.childActionMap.set(child.id, action);
    }

    get children(): IStateNode<TState>[] {
        return Array.from(this.childActionMap.values()).map((a) => a.result);
    }
}

export class RootNode<TState> extends AStateNode<TState> {
    constructor(state: StateLike<TState>, label = 'Root') {
        super(label, state);
    }

    get type(): 'Root' {
        return 'Root';
    }

    get level() {
        return 0;
    }
}

export class StateNode<TState>
    extends AStateNode<TState>
    implements IStateNode<TState>
{
    declare parent: IStateNode<TState>;
    declare actionToParent: IInverseActionNode<TState>;

    constructor(label: string, state: StateLike<TState>) {
        super(label, state);
    }

    get type(): 'State' {
        return 'State';
    }

    get level() {
        return this.parent.level;
    }
}
