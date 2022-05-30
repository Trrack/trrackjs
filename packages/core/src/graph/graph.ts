import { ASerializable } from '../utils/serializable';
import { INode, IRootNode, RootNode } from './nodes';

export type SerializedProvenanceGraph = {
  current: string;
  root: string;
  nodes: { [k: string]: any };
};

type CurrentChangeSource = 'new' | 'to' | 'undo' | 'redo';

export type CurrentChangeListener = (source: CurrentChangeSource) => void;

export class ProvenanceGraph extends ASerializable {
  private nodes: Map<string, INode>;
  private _current: INode;
  root: IRootNode;
  currentChangeListeners: CurrentChangeListener[] = [];

  constructor() {
    super();
    const root = RootNode.create();
    this.root = root;
    this._current = root;
    this.nodes = new Map();
    this.nodes.set(root.id, root);
  }

  static setup() {
    return new ProvenanceGraph();
  }

  addNode(node: INode, setCurrent: boolean = true) {
    this.nodes.set(node.id, node);

    if (setCurrent) {
      this.changeCurrent(node, 'new');
    }
  }

  get current() {
    return this._current;
  }

  changeCurrent(node: INode | string, source: CurrentChangeSource) {
    const target = typeof node === 'string' ? this.getNodeById(node) : node;

    this._current = target;

    this.currentChangeListeners.forEach((listener) => listener(source));
  }

  addCurrentChangeListener(listener: CurrentChangeListener) {
    this.currentChangeListeners.push(listener);
  }

  getNodeById(id: string) {
    const node = this.nodes.get(id);
    if (!node) throw new Error('Node does not exist');
    return node;
  }

  toJSON() {
    const nodes: { [k: string]: any } = {};

    this.nodes.forEach((node) => {
      nodes[node.id] = node.toJSON();
    });

    return {
      current: this.current.id,
      root: this.root.id,
      nodes,
    };
  }
}
