import { GenericArgs, TrrackAction } from '../../action';
import { getUUID } from '../../utils';
import { IActionNode, INode, NodeID } from './types';

type ActionNodeCreationParams<
    DA extends string,
    UDA extends string,
    D extends GenericArgs,
    U extends GenericArgs
> = {
    parent: INode;
    action: TrrackAction<DA, UDA, D, U>;
};

export class ActionNode<
    DA extends string,
    UDA extends string,
    D extends GenericArgs,
    U extends GenericArgs
> implements IActionNode<DA, UDA, D, U>
{
    id: NodeID = getUUID();
    type: 'ActionNode' = 'ActionNode';
    children: INode[] = [];
    createdOn = new Date();
    label: string;

    constructor(
        public readonly parent: INode,
        public readonly action: TrrackAction<DA, UDA, D, U>
    ) {
        this.label = action.label;
        parent.children.push(this);
    }

    get level(): number {
        return this.parent.level + 1;
    }

    static create<
        DA extends string,
        UDA extends string,
        D extends GenericArgs,
        U extends GenericArgs
    >({ parent, action }: ActionNodeCreationParams<DA, UDA, D, U>) {
        return new ActionNode(parent, action);
    }

    static isActionNode(
        node: INode
    ): node is ActionNode<string, string, any, any> {
        return node.type === 'ActionNode';
    }
}
