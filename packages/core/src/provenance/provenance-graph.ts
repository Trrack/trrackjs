import * as ngraph from 'ngraph.graph';
import createGraph, { Graph as NGraph, Node } from 'ngraph.graph';
import { EventedType } from 'ngraph.events';
import { ID } from '../utils';

function createBackingGraph<N, L>(opts?: Parameters<typeof createGraph>[0]) {
    return (ngraph as any)(opts) as Graph;
}

type ActionData = {
    type: 'Action';
};
type StateData = {
    type: 'State';
};
type RootData = StateData & {
    isRoot: true;
};

type ValidNodeData = ActionData | RootData | StateData;

type ActionNode = Node<ActionData>;
type StateNode = Node<StateData>;
type RootNode = Node<RootData>;
type ProvenanceNode = Node<ValidNodeData>;

type Graph = NGraph<ValidNodeData, any> & EventedType;

export class ProvenanceGraph {
    static init(graph?: Graph) {
        return new ProvenanceGraph(graph ? graph : createBackingGraph());
    }

    private _nodes: ProvenanceNode[] = [];
    private _actions: ActionNode[] = [];
    private _states: StateNode[] = [];

    private _rootNode: RootNode | null = null;
    current: StateNode;
    private lastAction: ActionNode | null = null;

    private constructor(private readonly backend: Graph) {
        if (backend.getNodesCount() === 0) {
            const rootNode = <RootNode>backend.addNode(ID.get(), {
                type: 'State',
                isRoot: true,
            });

            this._states.push(rootNode);
            this._rootNode = rootNode;
            this.current = rootNode;
        } else {
            this.backend.forEachNode((node) => {
                this.classifyNode(node);
            });

            this.current = this.rootNode;
        }
    }

    get rootNode() {
        if (this._rootNode) return this._rootNode;

        throw new Error('Root node not defined');
    }

    addNode(data: ValidNodeData) {
        const newNode = this.backend.addNode(ID.get(), data);

        this.backend.addLink(this.current.id, newNode.id);

        this.classifyNode(newNode);
    }

    private classifyNode(node: ProvenanceNode) {
        this._nodes.push(node);

        if (isStateNode(node)) {
            if (isRootNode(node)) {
                this._rootNode = node;
            }

            this._states.push(node);
        }

        if (isActionNode(node)) {
            this._actions.push(node);
        }
    }
}

function isRootNode(node: Node<ValidNodeData>): node is RootNode {
    return (node.data as any).isRoot;
}

function isStateNode(node: Node<ValidNodeData>): node is StateNode {
    return node.data.type === 'State';
}

function isActionNode(node: Node<ValidNodeData>): node is ActionNode {
    return node.data.type === 'Action';
}
