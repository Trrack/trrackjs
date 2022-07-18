import { GraphEdge } from '../graph_edge';
import { AProvenanceNode } from './abstract_graph_node';
import { NodeUtils } from './node_utils';
import { IActionNode, IStateNode } from './types';

export class StateNode extends AProvenanceNode implements IStateNode {
    static create(label: string): IStateNode {
        return new StateNode(label);
    }

    constructor(label: string) {
        super(label);
    }

    get type(): 'State' {
        return 'State';
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get children(): IStateNode[] {
        const nextEdges = this.outgoing.filter(GraphEdge.edgeType('next'));

        if (nextEdges.length === 0) return [];

        const nextNodes = nextEdges.map((edge) => edge.to);

        const directStateNodes = <IStateNode[]>(
            nextNodes.filter((node) => NodeUtils.isState(node))
        );

        const actionNodes = <IActionNode[]>(
            nextNodes.filter((node) => NodeUtils.isAction(node))
        );

        const actionDerivedStates = actionNodes.map((node) => node.result);

        return [...directStateNodes, ...actionDerivedStates];
    }
}
