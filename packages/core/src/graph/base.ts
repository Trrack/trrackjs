import { GraphEdge } from './graph_edge';
import { IGraphEdge, IGraphNode } from './types';

export class Graph<EdgeType extends string = string> {
    private nodes = new Map<string, IGraphNode<EdgeType>>();
    private edges = new Map<string, IGraphEdge<EdgeType>>();

    get nnodes() {
        return this.nodes.size;
    }

    get nedges() {
        return this.edges.size;
    }

    addNode(node: IGraphNode<EdgeType>) {
        // Enter Mod

        if (this.nodes.has(node.id))
            throw new Error(`Node ${node.id} already exists!`);

        this.nodes.set(node.id, node);

        // Exit Mod
        return node;
    }

    addEdge(
        source: IGraphNode<EdgeType>,
        target: IGraphNode<EdgeType>,
        type: EdgeType
    ): IGraphEdge<EdgeType> {
        // Enter Mod
        const edge = GraphEdge.create(source, target, type);

        this.edges.set(edge.id, edge);

        // Exit Mod
        return edge;
    }

    getNode(id: string): IGraphNode {
        const node = this.nodes.get(id);

        if (!node) throw new Error(`Node ${id} not found!`);

        return node;
    }

    forEachNode(cb: (node: IGraphNode<EdgeType>) => any, breakOnTruthy = true) {
        for (const node of this.nodes.values()) {
            if (breakOnTruthy && cb(node)) break;
        }
    }
}
