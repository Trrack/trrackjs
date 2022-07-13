import { ID } from '../../utils';
import { IGraphEdge, IGraphNode, IProvenanceNode, NodeType, SerializableGraphNode } from './types';

export abstract class AGraphNode<T extends string = string>
    implements IGraphNode<T>
{
    id: string;
    outgoing: IGraphEdge<T>[] = [];
    incoming: IGraphEdge<T>[] = [];
    createdOn = new Date();

    constructor() {
        this.id = ID.get();
    }

    get edges(): IGraphEdge<T>[] {
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

export abstract class AProvenanceNode<T extends string = string>
    extends AGraphNode<T>
    implements IProvenanceNode<T>
{
    abstract type: NodeType;

    constructor(public readonly label: string) {
        super();
    }

    get children() {
        return this.outgoing.map((edge) => edge.to as IProvenanceNode<T>);
    }

    get parent() {
        if (this.incoming.length === 0) throw new Error('No parent node.');

        if (this.incoming.length > 0)
            throw new Error('More than one parent node.');

        return <IProvenanceNode<T>>this.incoming[0].from;
    }

    get level() {
        return this.parent.level + 1;
    }
}
