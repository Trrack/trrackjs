import { ARootNode, INode, INonRootNode, IRootNode } from './types';

export class RootNode extends ARootNode implements IRootNode {
  constructor() {
    super();
  }

  static create() {
    return new RootNode();
  }

  static isRootNode(node: INode): node is IRootNode {
    return node.type === 'RootNode';
  }

  static isNonRootNode(node: INode): node is INonRootNode {
    return node.type !== 'RootNode';
  }
}
