import { ResultCreator } from 'omnibus-rxjs';

import { EventBus } from '../event/bus';
import { IGraphNode, NodeID } from './graph-elements';
import { CurrentChangeObject, CurrentChangeSource, IGraph } from './types';

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
    private changeCurrentEvent = EventBus.create<CurrentChangeObject<T>>();

    constructor(root: T) {
        this.current = root;
        this.addNode(root);
    }

    abstract jumpTo(nodeOrId: T | NodeID, source: CurrentChangeSource): void;

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

    nodeBy(id: NodeID): T {
        const node = this.nodes.get(id);
        if (!node) throw new Error(`Node ${id} not found!`);
        return node;
    }

    addNode(node: T, setCurrent = true) {
        if (this.nodes.has(node.id)) return;

        this.nodes.set(node.id, node);
        if (!this.edgeList.has(node.id)) this.edgeList.set(node.id, []);

        if (this.current !== node) this.addEdge(this.current, node);

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

    addCurrentChangeListener<TCon>(
        listener: ResultCreator<CurrentChangeObject<T>, TCon>
    ) {
        return this.changeCurrentEvent.listen(
            (obj) => obj.current.id !== obj.previousCurrent.id,
            listener
        );
    }

    protected updateCurrentNode(
        nodeOrId: T | NodeID,
        source: CurrentChangeSource
    ) {
        const previousCurrent = this.current;

        this.current =
            typeof nodeOrId === 'string' ? this.nodeBy(nodeOrId) : nodeOrId;

        this.changeCurrentEvent.trigger({
            current: this.current,
            previousCurrent,
            source,
        });
    }
}
