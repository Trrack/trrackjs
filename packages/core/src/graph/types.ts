import { INode, IRootNode } from './nodes';

export interface IProvenanceGraph {
    nodes: Map<string, INode>;
    readonly current: INode;
    root: IRootNode;
    addNode(node: INode): void;
    getNodeById(id: string): INode;
}

export type IReadonlyProvenanceGraph = Readonly<
    Pick<IProvenanceGraph, 'root' | 'current' | 'nodes'>
>;
