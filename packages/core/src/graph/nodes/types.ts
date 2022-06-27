import { GenericArgs, TrrackAction } from '../../action/types';

type NonRootNodeType = 'ActionNode' | 'StateNode';

export type NodeType = 'RootNode' | NonRootNodeType;

export type NodeID = string;

interface INodeDataDescription {
    label: string;
    createdOn: Date;
}

export interface INode extends INodeDataDescription {
    id: NodeID;
    type: NodeType;
    children: Array<INode>;
    parent: INode | null;
    level: number;
}

export interface IRootNode extends INode {
    type: 'RootNode';
    parent: null;
}

export interface INonRootNode extends INode {
    type: NonRootNodeType;
    parent: INode;
}

export interface IActionNode<D extends GenericArgs, U extends GenericArgs>
    extends INonRootNode {
    type: 'ActionNode';
    action: TrrackAction<D, U>;
}

export interface StateNode extends INonRootNode {
    type: 'StateNode';
}
