import { ApplyActionObject } from '../../provenance';

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
    readonly id: string;
    readonly createdOn: Date;
}

/**
 * Graph Edge
 */
export interface IGraphEdge<T extends string> extends UniqueEntityDescription {
    readonly from: IGraphNode<T>;
    readonly to: IGraphNode<T>;
    readonly type: T;
}

/**
 * Graph Node
 */
export interface IGraphNode<T extends string = string>
    extends UniqueEntityDescription {
    readonly outgoing: Array<IGraphEdge<T>>;
    readonly incoming: Array<IGraphEdge<T>>;
    readonly edges: Array<IGraphEdge<T>>;
}

export type NodeType = 'Root' | 'Action' | 'State';

/**
 * Generic provenance node
 */
export interface IProvenanceNode<T extends string = string>
    extends IGraphNode<T> {
    readonly type: NodeType;
    readonly label: string;
    readonly children: IProvenanceNode[];
    readonly level: number;
}

export interface IRootNode<T extends string = string>
    extends IProvenanceNode<T> {
    readonly type: 'Root';
}

export interface INonRootNode<T extends string = string>
    extends IProvenanceNode<T> {
    readonly parent: IProvenanceNode<T>;
}

export interface IActionNode<T extends string = string>
    extends INonRootNode<T> {
    readonly type: 'Action';
    readonly record: ApplyActionObject<any, any>;
    readonly isInverter: boolean;
    readonly counterActionNode: IActionNode<T>;
}

export interface IStateNode<T extends string = string> extends INonRootNode<T> {
    readonly type: 'State';
}

/**
 * Serializable types
 */
type SerializableUniqueEntityDescription = {
    id: string;
    createdOn: string;
};

export type SerializableGraphEdge = SerializableUniqueEntityDescription & {
    from: string;
    to: string;
    type: string;
};

export type SerializableGraphNode = SerializableUniqueEntityDescription & {
    outgoing: string[];
    incoming: string[];
};

export type SerializableProvenanceNode = SerializableGraphNode & {
    type: string;
    label: string;
    children: string[];
};

export type SerializableRootNode = SerializableProvenanceNode;

export type SerializableNonRootNode = SerializableProvenanceNode & {
    parent: string;
};

export type SerializableActionNode = SerializableNonRootNode & {
    record: ApplyActionObject<any, any>;
    isInverter: boolean;
    counterActionNode: string;
};

export type SerializableStateNode = SerializableNonRootNode &
    Record<string, never>;
