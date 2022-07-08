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

// type GraphEdgeType = 'uses' | 'resultsIn' | 'resultsFrom';

// export class GraphEdge extends AttributeContainer {
//     constructor(
//         public readonly source: GraphNode,
//         public readonly target: GraphEdge,
//         public readonly type: GraphEdgeType
//     ) {
//         super();
//     }
// }

// export class GraphNode extends AttributeContainer {
//     readonly outoging: GraphEdge[] = [];
//     readonly incoming: GraphEdge[] = [];
//     readonly id: string;

//     constructor(idGen: () => string = () => ID.get()) {
//         super();
//         this.id = idGen();
//     }
// }
