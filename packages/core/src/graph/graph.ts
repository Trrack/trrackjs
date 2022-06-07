import initEventManager from '../event';
import { INode, IRootNode, RootNode } from './nodes';
import { IProvenanceGraph, IReadonlyProvenanceGraph } from './types';

type CurrentChangeSource = 'new' | 'to' | 'undo' | 'redo';

export type CurrentChangeListener = (source: CurrentChangeSource) => void;

export class ProvenanceGraph implements IProvenanceGraph {
  private eventManager = initEventManager<[IReadonlyProvenanceGraph]>();

  static setup() {
    return new ProvenanceGraph();
  }

  private _current: INode;

  nodes: Map<string, INode>;
  root: IRootNode;

  constructor() {
    const root = RootNode.create();
    this.root = root;
    this._current = root;
    this.nodes = new Map();
    this.nodes.set(root.id, root);
  }

  addNode(node: INode, setCurrent = true) {
    this.nodes.set(node.id, node);
    this.eventManager.emit('add', this);

    if (setCurrent) {
      this.current = node;
    }
  }

  get current() {
    return this._current;
  }

  set current(node: INode) {
    this._current = node;
    this.eventManager.emit('current-change', this);
  }

  subscribe(
    event: 'current-change' | 'add-node',
    listener: (g: IReadonlyProvenanceGraph) => void
  ) {
    this.eventManager.subscribe(event, listener);
  }

  getNodeById(id: string) {
    const node = this.nodes.get(id);
    if (!node) throw new Error('Node does not exist');
    return node;
  }
}
