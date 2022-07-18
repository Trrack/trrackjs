import { EdgeType, IGraphEdge, IGraphNode, SerializableGraphEdge } from './nodes/types';

export class GraphEdge implements IGraphEdge {
    static create(
        from: IGraphNode,
        to: IGraphNode,
        type: EdgeType
    ): IGraphEdge {
        return new GraphEdge(from, to, type);
    }

    id: string;
    createdOn = new Date();

    private constructor(
        public readonly from: IGraphNode,
        public readonly to: IGraphNode,
        public readonly type: EdgeType
    ) {
        this.id = `${from.id} --- ${type} --- ${to.id}`;
        from.outgoing.push(this);
        to.incoming.push(this);
    }

    toJson(): SerializableGraphEdge {
        return {
            id: this.id,
            createdOn: this.createdOn.toJSON(),
            from: this.from.id,
            to: this.to.id,
            type: this.type,
        };
    }

    static edgeType(type: EdgeType) {
        return (edge: IGraphEdge) => edge.type === type;
    }
}
