import { ApplyActionObject, TrrackAction } from '../../provenance';
import { AProvenanceNode } from './abstract_graph_node';
import { StateNode } from './statenode';
import { IActionNode, IInverseActionNode, IRootNode, IStateNode } from './types';

export class ActionNode<TState>
    extends AProvenanceNode
    implements IActionNode<TState>
{
    readonly record: ApplyActionObject;
    readonly isInverse = false;
    declare inverseAction: IInverseActionNode<TState>;
    declare result: IStateNode<TState>;

    private readonly action: TrrackAction;
    public readonly triggeredBy: IStateNode<TState> | IRootNode<TState>;
    public readonly hasSideEffects: boolean;

    constructor({
        label,
        action,
        triggeredBy,
        hasSideEffects,
    }: {
        label: string;
        action: TrrackAction;
        triggeredBy: IRootNode<TState> | IStateNode<TState>;
        hasSideEffects: boolean;
    }) {
        super(`Do: ${label}`);
        this.action = action;
        this.triggeredBy = triggeredBy;
        this.hasSideEffects = hasSideEffects;
        this.record = this.action.do;
        this.execute();
        this.createInverseAction();
    }

    private execute() {
        this.triggeredBy.state.then((state) => {
            console.log('Figure out state');
            this.result = new StateNode(this.label, state);
            this.triggeredBy.addChildNode(this.result, this);
        });
    }

    private createInverseAction() {
        this.inverseAction = new InverseActionNode({
            label: `Undo: ${this.label}`,
            action: this.action,
            result: this.triggeredBy,
            triggeredBy: this.result,
            hasSideEffects: this.hasSideEffects,
            invertsAction: this,
        });
    }

    get type(): 'Action' {
        return 'Action';
    }
}

export class InverseActionNode<TState>
    extends AProvenanceNode
    implements IInverseActionNode<TState>
{
    readonly record: ApplyActionObject;
    readonly isInverse = true;

    private readonly action: TrrackAction;
    readonly result: IStateNode<TState> | IRootNode<TState>;
    readonly triggeredBy: IStateNode<TState>;
    readonly invertsAction: IActionNode<TState>;
    readonly hasSideEffects: boolean;

    constructor({
        label,
        action,
        result,
        triggeredBy,
        invertsAction,
        hasSideEffects,
    }: {
        label: string;
        action: TrrackAction;
        result: IStateNode<TState> | IRootNode<TState>;
        triggeredBy: IStateNode<TState>;
        invertsAction: IActionNode<TState>;
        hasSideEffects: boolean;
    }) {
        super(label);
        this.action = action;
        this.result = result;
        this.triggeredBy = triggeredBy;
        this.invertsAction = invertsAction;
        this.hasSideEffects = hasSideEffects;
        this.record = this.action.undo;
    }

    get type(): 'Action' {
        return 'Action';
    }
}
