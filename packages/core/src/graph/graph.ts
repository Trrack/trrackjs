import { initEventManager } from '../event';
import { INode, IRootNode, RootNode } from './nodes';
import { IProvenanceGraph } from './types';

type CurrentChangeSource = 'new' | 'to' | 'undo' | 'redo';

export type CurrentChangeListener = (source: CurrentChangeSource) => void;

export class ProvenanceGraph implements IProvenanceGraph {
    static setup() {
        return new ProvenanceGraph();
    }

    private eventManager = initEventManager<{
        currentChanged: [current: INode];
    }>();

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

        if (setCurrent) {
            this.current = node;
        }
    }

    get current() {
        return this._current;
    }

    set current(node: INode) {
        console.log('Hello');
        this._current = node;
    }

    subscribe(ev: any, listener: (node: INode) => void) {
        this.eventManager.subscribe(ev, listener);
    }

    clear(ev: any) {
        this.eventManager.clearEvent(ev);
    }

    getNodeById(id: string) {
        const node = this.nodes.get(id);
        if (!node) throw new Error('Node does not exist');
        return node;
    }
}
