import { initEventManager } from '../event';
import { INode, IRootNode, RootNode } from './nodes';
import { CurrentChangeListener, CurrentChangeSource, IProvenanceGraph, ProvenanceGraphEvents } from './types';

export class ProvenanceGraph implements IProvenanceGraph {
    static setup(): IProvenanceGraph {
        return new ProvenanceGraph();
    }

    private eventManager = initEventManager<ProvenanceGraphEvents>();
    private _current: INode;
    private _nodes: Map<string, INode>;
    private _root: IRootNode;

    constructor() {
        const root = RootNode.create();
        this._root = root;
        this._current = root;
        this._nodes = new Map();
        this._nodes.set(root.id, root);
    }

    get current() {
        return this._current;
    }

    get root() {
        return this._root;
    }

    get n_size() {
        return this._nodes.size;
    }

    get nodes() {
        return Array.from(this._nodes.values());
    }

    addNode(node: INode, setCurrent = true) {
        if (node instanceof RootNode) {
            throw new Error('Cannot add a root node to the graph manually!');
        }

        this._nodes.set(node.id, node);

        if (setCurrent) {
            this.changeCurrent(node, 'add');
        }
    }

    moveCurrent(to: INode, source: CurrentChangeSource): void {
        this.changeCurrent(to, source);
    }

    node(id: string) {
        const node = this._nodes.get(id);
        if (!node) throw new Error('Node does not exist');
        return node;
    }

    get(serialized = false) {
        console.log(serialized);

        return {
            current: this._current,
            root: this._root,
            nodes: this._nodes,
        };
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

    private changeCurrent(
        to: INode,
        source: CurrentChangeSource,
        path?: INode[]
    ) {
        if (this._current === to) return;

        const oldCurrent = this._current;

        this._current = to;

        this.eventManager.emit('currentChanged', to, {
            source,
            previousCurrentNode: oldCurrent,
            path,
        });
    }
}
