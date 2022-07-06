import { TrrackAction } from '../action';
import { AProvenanceNode, IActionNode } from './types';

export class ActionNode extends AProvenanceNode implements IActionNode {
    static create(
        label: string,
        action: TrrackAction<any, any, any, any>
    ): IActionNode {
        return new ActionNode(label, action);
    }

    type: 'Action' = 'Action';

    private constructor(
        label: string,
        public readonly action: TrrackAction<any, any, any, any>
    ) {
        super(label);
    }
}
