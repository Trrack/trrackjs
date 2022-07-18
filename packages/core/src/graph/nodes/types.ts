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
 * Graph EdgeType and Edge
 */
export type EdgeType =
    | 'previous'
    | 'next'
    | 'inverts'
    | 'inverted_by'
    | 'results_in';
export interface IGraphEdge extends UniqueEntityDescription {
    readonly from: IGraphNode;
    readonly to: IGraphNode;
    readonly type: EdgeType;
}

/**
 * Graph Node
 */
export interface IGraphNode extends UniqueEntityDescription {
    readonly outgoing: Array<IGraphEdge>;
    readonly incoming: Array<IGraphEdge>;
    readonly edges: Array<IGraphEdge>;
}

export type NodeType = 'Root' | 'Action' | 'State';

/**
 * Generic provenance node
 */
export interface IProvenanceNode extends IGraphNode {
    readonly type: NodeType;
    readonly label: string;
    readonly level: number;
}

export interface IStateNode extends IProvenanceNode {
    readonly type: 'State';
    isLeaf: boolean;
    children: IStateNode[];
}

export interface IActionNode extends IProvenanceNode {
    readonly type: 'Action';
    readonly record: ApplyActionObject<any, any>;
    readonly isInverse: boolean;
    readonly isInvertible: boolean;
    readonly hasSideEffects: boolean;
    inverse: IActionNode | null;
    inverts: IActionNode | null;
    result: IStateNode;
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
