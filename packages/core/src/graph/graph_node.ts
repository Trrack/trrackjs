import { ID } from '../utils';
import { IGraphEdge, IGraphNode, ISerializableGraphNode } from './types';

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

    toJson(): ISerializableGraphNode {
        return {
            id: this.id,
            createdOn: this.createdOn.toJSON(),
            outgoing: this.outgoing.map((e) => e.id),
            incoming: this.incoming.map((e) => e.id),
        };
    }
}

export class RootNode

export class StateNode<T extends string = string> extends AGraphNode<T> {}

export class ActionNode<T extends string = string> extends AGraphNode<T> {}