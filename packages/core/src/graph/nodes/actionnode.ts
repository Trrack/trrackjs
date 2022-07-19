import { ApplyActionObject } from '../../provenance';
import { GraphEdge } from '../graph_edge';
import { AProvenanceNode } from './abstract_graph_node';
import { IActionNode, IStateNode } from './types';

export class ActionNode<TState>
    extends AProvenanceNode
    implements IActionNode<TState>
{
    static create<TState>(
        label: string,
        record: ApplyActionObject<any, any>,
        hasSideEffects: boolean,
        isInverse: boolean
    ): IActionNode<TState> {
        return new ActionNode<TState>(label, record, hasSideEffects, isInverse);
    }

    type: 'Action' = 'Action';

    constructor(
        label: string,
        public readonly record: ApplyActionObject<any, any>,
        public readonly hasSideEffects: boolean,
        public readonly isInverse: boolean
    ) {
        super(label);
    }

    get isInvertible() {
        if (!this.hasSideEffects) return false;
        return !this.isInverse && this.inverse !== null;
    }

    get inverse() {
        if (this.isInverse) return null;

        const invertingEdges = this.outgoing.filter(
            GraphEdge.edgeType('inverted_by')
        );

        if (invertingEdges.length === 0)
            throw new Error('No inverse node found');

        if (invertingEdges.length > 1)
            throw new Error('Too many inverting edges.');

        const invertingNode = invertingEdges[0].to as IActionNode<TState>;

        if (!invertingNode.isInverse)
            throw new Error('Incorrect inverting node.');

        return invertingNode;
    }

    get inverts() {
        if (!this.isInverse) return null;

        const invertsEdges = this.outgoing.filter(
            GraphEdge.edgeType('inverts')
        );

        if (invertsEdges.length === 0)
            throw new Error('No reference for toInvert node');
        if (invertsEdges.length > 1)
            throw new Error('Too many nodes to invert');

        return invertsEdges[0].to as IActionNode<TState>;
    }

    get result(): IStateNode<TState> {
        const resultsIn = this.outgoing.filter(
            GraphEdge.edgeType('results_in')
        );

        if (resultsIn.length !== 1)
            throw new Error('Incorrect pointer to result from action node.');

        return resultsIn[0].to as IStateNode<TState>;
    }
}
