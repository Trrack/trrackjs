import { ActionNode, EdgeType, Graph, IGraphNode, IStateNode, StateNode } from '../graph';
import { TrrackAction } from './action';

export class ProvenanceGraph {
    currentNode: IStateNode;

    constructor(public readonly backend: Graph = new Graph()) {
        if (backend.nnodes > 0) {
            if (!this.hasRoot)
                throw new Error(
                    'Incorrect provenance graph. No root node found.'
                );
        } else {
            backend.addNode(StateNode.create('Start'));
        }

        this.currentNode = this.root;
    }

    private verifyAndGetRoot() {
        const stateNodes = this.backend.nodesBy<IStateNode>(
            (n) =>
                n.type === 'State' &&
                n.incoming.length === 0 &&
                n.label === 'Start'
        );

        return stateNodes.length === 1 ? stateNodes[0] : stateNodes.length;
    }

    private get hasRoot(): boolean {
        return typeof this.verifyAndGetRoot() !== 'number';
    }

    get root(): IStateNode {
        const stateNode = this.verifyAndGetRoot();

        if (typeof stateNode === 'number') {
            throw new Error(
                stateNode === 0
                    ? 'No root node found. Incorrect provenance initialization.'
                    : 'Too many root nodes found. Invalid provenance graph.'
            );
        }

        return stateNode;
    }

    addAction(label: string, action: TrrackAction) {
        const actionNode = this.addNode(
            ActionNode.create(label, action.do, false) // Create action node
        );
        this.addEdge(this.currentNode, actionNode, 'next'); // connect current state node to action node

        const newStateNode = this.addNode(StateNode.create(label)); // Create new statenode
        this.addEdge(actionNode, newStateNode, 'results_in'); // Connect action to newState node

        const inverseActionNode = this.addNode(
            ActionNode.create(label, action.undo, true) // Create inverse action node
        );
        this.addEdge(actionNode, inverseActionNode, 'inverted_by'); // connect action to inverse
        this.addEdge(inverseActionNode, actionNode, 'inverts'); // connect inverse to action

        this.addEdge(newStateNode, inverseActionNode, 'previous'); // connect newstate to inverse
        this.addEdge(inverseActionNode, this.currentNode, 'results_in'); // connect inverse to current state

        this.changeCurrent(newStateNode); // update current state to new state
    }

    addState(label: string) {
        const stateNode = this.addNode(StateNode.create(label));
    }

    private changeCurrent(node: IStateNode) {
        this.currentNode = node;
    }

    private addNode<T extends IGraphNode>(node: T): T {
        return this.backend.addNode(node);
    }

    private addEdge(source: IGraphNode, target: IGraphNode, type: EdgeType) {
        return this.backend.addEdge(source, target, type);
    }
}
