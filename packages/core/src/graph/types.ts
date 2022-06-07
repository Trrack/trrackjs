import { INode, IRootNode } from './nodes';

export interface IProvenanceGraph extends IReadonlyProvenanceGraph {
  addNode(node: INode): void;
  getNodeById(id: string): INode;
}

export interface IReadonlyProvenanceGraph {
  nodes: Map<string, INode>;
  readonly current: INode;
  root: IRootNode;
}
