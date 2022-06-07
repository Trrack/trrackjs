import { getUUID } from '../../utils';
import { INode, IRootNode, NodeID } from './types';

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
}
