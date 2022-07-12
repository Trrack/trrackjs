/**
 * Base serialization class
 */
interface ISerializable {
    toJson(): any;
}

/**
 * Descibes entities
 */
interface UniqueEntityDescription extends ISerializable {
    id: string;
    createdOn: Date;
}

/**
 * De
 */
type SerializableUniqueEntityDescription = {
    id: string;
    createdOn: string;
};

export interface IGraphEdge<T extends string> extends UniqueEntityDescription {
    from: IGraphNode<T>;
    to: IGraphNode<T>;
    type: T;
}

export type ISerializableGraphEdge = SerializableUniqueEntityDescription & {
    from: string;
    to: string;
    type: string;
};

export interface IGraphNode<T extends string = string>
    extends UniqueEntityDescription {
    outgoing: Array<IGraphEdge<T>>;
    incoming: Array<IGraphEdge<T>>;
    edges: Array<IGraphEdge<T>>;
}

export type ISerializableGraphNode = SerializableUniqueEntityDescription & {
    outgoing: string[];
    incoming: string[];
};
