import { GraphUtils } from '../base';
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

    state: PromiseLike<StateLike<TState>>;

    constructor(label: string, state: StateLike<TState>) {
        super(label);
        this.state = Promise.resolve(state);
    }

    get level() {
        if (this.parent) return this.parent.level + 1;
        return 0;
    }

    get type(): 'State' {
        return 'State';
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get nextActions() {
        return this.outgoing
            .filter(GraphEdge.edgeType('next'))
            .map((e) => <IActionNode<TState>>e.to);
    }

    get resultsFrom(): IActionNode<TState> {
        const resultsFromNodes = this.incoming
            .filter(GraphEdge.edgeType('results_in'))
            .map((e) => <IActionNode<TState>>e.from);

        if (resultsFromNodes.length !== 1)
            throw new Error('State should result from only one action.');

        return resultsFromNodes[0];
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
        const creatorActions = this.incoming
            .filter(GraphEdge.edgeType('results_in'))
            .map((e) => <IActionNode<TState>>e.from);

        if (creatorActions.length === 0) return null; // This is root

        if (creatorActions.length > 1)
            throw new Error('Invalid provenance graph. Too many parent nodes.'); // Throw error on multiple parent nodes.

        return creatorActions[0].invokedBy;
    }

    actionNodeTo(node: IStateNode<TState>): IActionNode<TState> {
        const isNodeUp = GraphUtils.isNextNodeUp(this, node);

        if (isNodeUp) {
            const prevs = this.outgoing
                .filter(GraphEdge.edgeType('previous'))
                .map((e) => <IActionNode<TState>>e.to);

            return prevs[0];
        } else {
            const nexts = this.outgoing
                .filter(GraphEdge.edgeType('next'))
                .map((e) => <IActionNode<TState>>e.to);

            const nodeResultsFrom = node.incoming
                .filter(GraphEdge.edgeType('results_in'))
                .map((e) => <IActionNode<TState>>e.from);

            const commonNode = new Set(
                nexts.filter((n) => nodeResultsFrom.includes(n))
            );
            if (commonNode.size === 1) return Array.from(commonNode)[0];
            throw new Error('Multiple transition node detected.');
        }

        if (this.nextActions.includes(node.resultsFrom))
            return node.resultsFrom;

        if (node.nextActions.includes(this.resultsFrom))
            return this.resultsFrom;

        throw new Error('No transition action between give state nodes.');
    }
}
