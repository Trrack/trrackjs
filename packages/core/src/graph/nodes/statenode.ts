import { GraphEdge } from '../graph_edge';
import { AProvenanceNode } from './abstract_graph_node';
import { NodeUtils } from './node_utils';
import { IActionNode, IProvenanceNode, IStateNode, StateLike } from './types';

export class StateNode<TState>
    extends AProvenanceNode
    implements IStateNode<TState>
{
    static create<TState>(
        label: string,
        state: StateLike<TState>
    ): IStateNode<TState> {
        return new StateNode<TState>(label, state);
    }

    declare state: Promise<StateLike<TState>>;

    constructor(label: string, state: StateLike<TState>) {
        super(label);
        this.state = Promise.resolve(state);
        console.log('Remove declare from stateLike');
    }

    get type(): 'State' {
        return 'State';
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get children(): IStateNode<TState>[] {
        const nextEdges = this.outgoing.filter(GraphEdge.edgeType('next'));

        if (nextEdges.length === 0) return [];

        const nextNodes = nextEdges.map((edge) => <IProvenanceNode>edge.to);

        const directStateNodes = <IStateNode<TState>[]>(
            nextNodes.filter((node) => NodeUtils.isState(node))
        );

        const actionNodes = <IActionNode<TState>[]>(
            nextNodes.filter((node) => NodeUtils.isAction(node))
        );

        const actionDerivedStates = actionNodes.map((node) => node.result);

        return [...directStateNodes, ...actionDerivedStates];
    }

    get parent() {
        const previousPointedNodes = this.outgoing
            .filter(GraphEdge.edgeType('previous'))
            .map((e) => e.to);

        if (previousPointedNodes.length === 0) return null; // This is root

        if (previousPointedNodes.length > 1)
            throw new Error('Invalid provenance graph. Too many parent nodes.'); // Throw error on multiple parent nodes.

        const previousNode = <IProvenanceNode>previousPointedNodes[0];

        console.log('Hello');

        if (NodeUtils.isState<TState>(previousNode)) return previousNode;
        else if (NodeUtils.isAction<TState>(previousNode)) {
            return previousNode.result;
        } else {
            throw new Error('Cannot determine parent.');
        }
    }
}
