import { IProvenanceNode, IRootNode, IStateNode, NodeUtils } from './nodes';

export class Graph {
    nodes = new Map<string, IProvenanceNode>();
    root: IRootNode<any> | null = null;

    get nnodes() {
        return this.nodes.size;
    }

    hasNode(id: string) {
        return this.nodes.has(id);
    }

    addNode<T extends IProvenanceNode>(node: T): T {
        // Enter Mod

        if (this.nodes.has(node.id))
            throw new Error(`Node ${node.id} already exists!`);

        this.nodes.set(node.id, node);

        if (NodeUtils.isRoot(node)) {
            if (this.root) throw new Error(`Root already exists!`);
            this.root = node;
        }

        // Exit Mod
        return node;
    }

    getNode<T extends IProvenanceNode = IProvenanceNode>(id: string): T {
        const node = this.nodes.get(id);

        if (!node) throw new Error(`Node ${id} not found!`);

        return node as T;
    }
}

type AnyStateNode = IStateNode<any> | IRootNode<any>;

export class GraphUtils {
    private static LCA<T>(
        current: AnyStateNode,
        destination: AnyStateNode
    ): AnyStateNode {
        let [source, target] = [current, destination];

        if (source.level > target.level) {
            [source, target] = [target, source];
        }

        let diff = target.level - source.level;

        while (diff !== 0) {
            if (NodeUtils.isState(target)) {
                target = target.parent;
                diff -= 1;
            } else {
                break;
            }
        }

        if (source.id === target.id) return source;

        while (source.id !== target.id) {
            if (NodeUtils.isState(source)) source = source.parent;
            if (NodeUtils.isState(target)) target = target.parent;
        }

        return source;
    }

    static getPath<T>(
        current: AnyStateNode,
        destination: AnyStateNode
    ): Array<AnyStateNode> {
        const lca = GraphUtils.LCA(current, destination);

        const pathFromSourceToLca: AnyStateNode[] = [];
        const pathFromDestinationToLca: AnyStateNode[] = [];

        let [source, target] = [current, destination];

        while (source !== lca) {
            pathFromSourceToLca.push(source);
            if (NodeUtils.isState(source)) {
                source = source.parent;
            }
        }

        pathFromSourceToLca.push(source);

        while (target !== lca) {
            pathFromDestinationToLca.push(target);
            if (NodeUtils.isState(target)) {
                target = target.parent;
            }
        }

        return [...pathFromSourceToLca, ...pathFromDestinationToLca.reverse()];
    }

    static isNextNodeUp<T>(
        source: AnyStateNode,
        target: AnyStateNode
    ): boolean {
        if (NodeUtils.isState(source) && source.parent.id === target.id)
            return true;

        if (NodeUtils.isState(target) && target.parent.id === source.id)
            return false;

        throw new Error(
            `Illegal use of function. Nodes ${source.id} and ${target.id} are not connected.`
        );
    }
}
