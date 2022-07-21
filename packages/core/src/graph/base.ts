import { GraphEdge } from './graph_edge';
import { EdgeType, IGraph, IGraphEdge, IGraphNode, IStateNode } from './nodes/types';

export class GraphUtils {
    private static LCA<T>(
        current: IStateNode<T>,
        destination: IStateNode<T>
    ): IStateNode<T> {
        let [source, target] = [current, destination];

        if (source.level > target.level) {
            [source, target] = [target, source];
        }

        let diff = target.level - source.level;

        while (diff !== 0) {
            if (!target.parent) break;
            target = target.parent;
            diff -= 1;
        }

        if (source.id === target.id) return source;

        while (source.id !== target.id) {
            if (source.parent) source = source.parent;
            if (target.parent) target = target.parent;
        }

        return source;
    }

    static getPath<T>(
        current: IStateNode<T>,
        destination: IStateNode<T>
    ): Array<IStateNode<T>> {
        const lca = GraphUtils.LCA(current, destination);

        const pathFromSourceToLca: IStateNode<T>[] = [];
        const pathFromDestinationToLca: IStateNode<T>[] = [];

        let [source, target] = [current, destination];

        while (source !== lca) {
            pathFromSourceToLca.push(source);
            if (source.parent) {
                source = source.parent;
            }
        }

        pathFromSourceToLca.push(source);

        while (target !== lca) {
            pathFromDestinationToLca.push(target);
            if (target.parent) {
                target = target.parent;
            }
        }

        return [...pathFromSourceToLca, ...pathFromDestinationToLca.reverse()];
    }

    static isNextNodeUp<T>(
        source: IStateNode<T>,
        target: IStateNode<T>
    ): boolean {
        if (source.parent && source.parent.id === target.id) return true;

        if (target.parent && target.parent.id === source.id) return false;

        throw new Error(
            `Illegal use of function. Nodes ${source.id} and ${target.id} are not connected.`
        );
    }
}

export class Graph implements IGraph {
    static create(): IGraph {
        return new Graph();
    }

    nodes = new Map<string, IGraphNode>();
    edges = new Map<string, IGraphEdge>();

    get nnodes() {
        return this.nodes.size;
    }

    get nedges() {
        return this.edges.size;
    }

    hasNode(id: string) {
        return this.nodes.has(id);
    }

    hasEdge(id: string) {
        return this.edges.has(id);
    }

    addNode<T extends IGraphNode>(node: T): T {
        // Enter Mod

        if (this.nodes.has(node.id))
            throw new Error(`Node ${node.id} already exists!`);

        this.nodes.set(node.id, node);

        // Exit Mod
        return node;
    }

    addEdge(
        source: IGraphNode,
        target: IGraphNode,
        type: EdgeType
    ): IGraphEdge {
        // Enter Mod
        const edge = GraphEdge.create(source, target, type);

        this.edges.set(edge.id, edge);

        // Exit Mod
        return edge;
    }

    getNode<T extends IGraphNode = IGraphNode>(id: string): T {
        const node = this.nodes.get(id);

        if (!node) throw new Error(`Node ${id} not found!`);

        return node as T;
    }

    nodesBy<T extends IGraphNode = IGraphNode>(
        callback: (node: T) => boolean
    ): T[] {
        return Array.from(this.nodes.values()).filter((node) =>
            callback(<T>node)
        ) as T[];
    }
}
