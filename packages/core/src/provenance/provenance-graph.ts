import { AGraph, CurrentChangeSource, IGraph, NodeID } from '../graph';
import { IProvenanceNode, IRootNode, RootNode } from './node';

export interface IProvenanceGraph extends IGraph<IProvenanceNode> {
    readonly root: IRootNode;
}

export class ProvenanceGraph
    extends AGraph<IProvenanceNode>
    implements IProvenanceGraph
{
    static init(): IProvenanceGraph {
        return new ProvenanceGraph(RootNode.create());
    }

    private constructor(public readonly root: IRootNode) {
        super(root);
    }

    jumpTo(
        nodeOrId: IProvenanceNode | NodeID,
        source: CurrentChangeSource = 'jump'
    ) {
        this.updateCurrentNode(nodeOrId, source);
    }
}
