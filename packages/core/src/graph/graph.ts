import { initEventManager } from '../event';
import { INode, IRootNode, RootNode } from './nodes';
import { IProvenanceGraph } from './types';

type CurrentChangeSource = 'add' | 'to' | 'undo' | 'redo';

export type CurrentChangeListener = (
    current: INode,
    opts?: {
        source?: CurrentChangeSource;
        previousCurrentNode?: INode;
        path?: INode[];
    }
) => void;

type ProvenanceGraphEvents = {
    currentChanged: Parameters<CurrentChangeListener>;
};

export class ProvenanceGraph implements IProvenanceGraph {
    static setup() {
        return new ProvenanceGraph();
    }

    private eventManager = initEventManager<ProvenanceGraphEvents>();

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
        if (node instanceof RootNode) {
            throw new Error('Cannot add a root node to the graph manually!');
        }

        this.nodes.set(node.id, node);

        if (setCurrent) {
            this.changeCurrent(node, 'add');
        }
    }

    changeCurrent(to: INode, source: CurrentChangeSource, path?: INode[]) {
        if (this.current === to) return;

        const oldCurrent = this.current;

        this._current = to;

        this.eventManager.emit('currentChanged', to, {
            source,
            previousCurrentNode: oldCurrent,
            path,
        });
    }

    get current() {
        return this._current;
    }

    subscribe(
        ev: keyof ProvenanceGraphEvents,
        listener: CurrentChangeListener
    ) {
        this.eventManager.subscribe(ev, listener);
    }

    clear(ev: keyof ProvenanceGraphEvents) {
        this.eventManager.clearEvent(ev);
    }

    getNodeById(id: string) {
        const node = this.nodes.get(id);
        if (!node) throw new Error('Node does not exist');
        return node;
    }
}
