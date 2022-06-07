import { Action } from '../../action';
import { getUUID } from '../../utils';
import { IActionNode, INode, NodeID } from './types';

type ActionNodeCreationParams = {
    label: string;
    parent: INode;
    action: Action;
};

export class ActionNode implements IActionNode {
    id: NodeID = getUUID();
    type: 'ActionNode' = 'ActionNode';
    children: INode[] = [];
    createdOn = new Date();

    constructor(
        public readonly label: string,
        public readonly parent: INode,
        public readonly action: Action
    ) {
        parent.children.push(this);
    }

    get level(): number {
        return this.parent.level + 1;
    }

    static create({ label, parent, action }: ActionNodeCreationParams) {
        return new ActionNode(label, parent, action);
    }
}
