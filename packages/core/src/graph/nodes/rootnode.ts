import { getUUID } from '../../utils';
import { INode, INonRootNode, IRootNode, NodeID } from './types';

export class RootNode implements IRootNode {
    id: NodeID = getUUID();
    children: INode[] = [];
    createdOn = new Date();
    label = 'Root';
    type: 'RootNode' = 'RootNode';
    level = 0;
    parent = null;

    static create() {
        return new RootNode();
    }

    static isRootNode(node: INode): node is IRootNode {
        return node.type === 'RootNode';
    }

    static isNonRootNode(node: INode): node is INonRootNode {
        return node.type !== 'RootNode';
    }
}
