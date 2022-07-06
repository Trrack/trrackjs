import { ID } from '../utils';

export type NodeID = string;

export interface IGraphNode {
    id: NodeID;
    createdOn: Date;
    incoming: IGraphNode[];
    outgoing: IGraphNode[];

    // connectFrom(node: IGraphNode): void;
    // connectTo(node: IGraphNode): void;
}

export abstract class AGraphNode implements IGraphNode {
    id = ID.get();
    createdOn: Date = new Date();
    incoming: IGraphNode[] = [];
    outgoing: IGraphNode[] = [];
}
