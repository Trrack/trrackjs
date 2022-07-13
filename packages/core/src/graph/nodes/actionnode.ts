import { ApplyActionObject, TrrackAction } from '../../provenance';
import { AProvenanceNode } from './abstract_graph_node';
import { IActionNode } from './types';

export class ActionNode<T extends string = string>
    extends AProvenanceNode<T>
    implements IActionNode<T>
{
    static create<T extends string>(
        label: string,
        action: TrrackAction,
        isInverter = false,
        counter: IActionNode<T> | null = null
    ): IActionNode<T> {
        return new ActionNode<T>(label, action, isInverter, counter);
    }

    type: 'Action' = 'Action';
    readonly record: ApplyActionObject<any, any>;
    declare counterActionNode: IActionNode<T>;

    private constructor(
        label: string,
        action: TrrackAction,
        public readonly isInverter: boolean,
        counter: IActionNode<T> | null
    ) {
        super(label);
        this.record = isInverter ? action.undo : action.do;

        if (counter) {
            this.counterActionNode = counter;
        }
        if (!isInverter) {
            this.setupInverseNode(action);
        }
    }

    private setupInverseNode(action: TrrackAction) {
        const inverseAction = ActionNode.create<T>(this.label, action, true);
        this.counterActionNode = inverseAction;
    }
}
