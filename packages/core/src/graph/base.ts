import { EventBus } from '../event/bus';
import { IGraphNode, NodeID } from './node';

type CurrentChangeSource = 'add' | 'to' | 'undo' | 'redo';

export interface IGraph<T extends IGraphNode> {
    readonly nodes: Map<NodeID, T>;
    readonly edgeList: Map<NodeID, Array<T>>;
    readonly current: T;
    readonly nnodes: number;
    readonly nedges: number;
    addNode(node: T): void;
    getNodes(sortFn?: (a: T, b: T) => number): T[];
    undo(): void;
    redo(): void;
    jumpTo(nodeOrId: T | string): void;
}

export abstract class AGraph<T extends IGraphNode> implements IGraph<T> {
    // Attributes
    nodes = new Map<NodeID, T>();
    edgeList = new Map<NodeID, Array<T>>();
    current: T;

    // Listeners
    private addNodeEvent = EventBus.create<T>();
    private addEdgeEvent = EventBus.create<{
        source: T;
        target: T;
    }>();
    private changeCurrentEvent = EventBus.create<{
        current: T;
        previousCurrent: T;
        source: CurrentChangeSource;
    }>();

    constructor(root: T) {
        this.current = root;
        this.addNode(root);
    }

    abstract undo(): void;
    abstract redo(): void;
    abstract jumpTo(nodeOrId: T | string): void;

    get nnodes() {
        return this.nodes.size;
    }

    get nedges() {
        let edgeCount = 0;

        this.edgeList.forEach((val) => {
            edgeCount += val.length;
        });

        return edgeCount;
    }

    addNode(node: T, setCurrent = true) {
        if (this.nodes.has(node.id)) return;

        this.nodes.set(node.id, node);
        if (!this.edgeList.has(node.id)) this.edgeList.set(node.id, []);

        this.addNodeEvent.trigger(node);

        if (setCurrent) this.updateCurrentNode(node, 'add');
    }

    addEdge(source: T, target: T) {
        source.outgoing.push(target);
        target.incoming.push(source);

        const edges = this.edgeList.get(source.id) || [];
        edges.push(target);
        this.edgeList.set(source.id, edges);

        this.addEdgeEvent.trigger({ source, target });
    }

    getNodes(
        sortFn: (a: T, b: T) => number = (a, b) =>
            a.createdOn.getTime() - b.createdOn.getTime()
    ): T[] {
        return Array.from(this.nodes.values()).sort(sortFn);
    }

    private updateCurrentNode(node: T, source: CurrentChangeSource) {
        const previousCurrent = this.current;
        this.current = node;
        this.changeCurrentEvent.trigger({
            current: node,
            previousCurrent,
            source,
        });
    }
}
