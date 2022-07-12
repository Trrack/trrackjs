import { IGraphEdge, IGraphNode, ISerializableGraphEdge } from './types';

export class GraphEdge<T extends string = string> implements IGraphEdge<T> {
    static create<T extends string = string>(
        from: IGraphNode<T>,
        to: IGraphNode<T>,
        type: T
    ): IGraphEdge<T> {
        return new GraphEdge<T>(from, to, type);
    }

    id: string;
    createdOn = new Date();

    private constructor(
        public readonly from: IGraphNode<T>,
        public readonly to: IGraphNode<T>,
        public readonly type: T
    ) {
        this.id = `${from.id} --- ${type} --- ${to.id}`;
    }

    toJson(): ISerializableGraphEdge {
        return {
            id: this.id,
            createdOn: this.createdOn.toJSON(),
            from: this.from.id,
            to: this.to.id,
            type: this.type,
        };
    }
}
