import { ID } from '../../utils';
import { IGraphEdge, IGraphNode, IProvenanceNode, NodeType, SerializableGraphNode } from './types';

export abstract class AGraphNode implements IGraphNode {
    id: string;
    outgoing: IGraphEdge[] = [];
    incoming: IGraphEdge[] = [];
    createdOn = new Date();

    constructor() {
        this.id = ID.get();
    }

    get edges(): IGraphEdge[] {
        return [...this.outgoing, ...this.incoming];
    }

    toJson(): SerializableGraphNode {
        return {
            id: this.id,
            createdOn: this.createdOn.toJSON(),
            outgoing: this.outgoing.map((e) => e.id),
            incoming: this.incoming.map((e) => e.id),
        };
    }
}

export abstract class AProvenanceNode
    extends AGraphNode
    implements IProvenanceNode
{
    abstract type: NodeType;

    constructor(public readonly label: string) {
        super();
    }

    get parent() {
        if (this.incoming.length === 0) throw new Error('No parent node.');

        if (this.incoming.length > 1)
            throw new Error('More than one parent node.');

        return <IProvenanceNode>this.incoming[0].from;
    }

    get level() {
        if (this.incoming.length === 0) return 0;
        return this.parent.level + 1;
    }
}
