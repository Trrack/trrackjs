import { AProvenanceNode } from './abstract_graph_node';
import { IRootNode } from './types';

export class RootNode<T extends string>
    extends AProvenanceNode<T>
    implements IRootNode<T>
{
    static create<T extends string>(): IRootNode<T> {
        return new RootNode<T>();
    }

    private constructor() {
        super('Root');
    }

    get type(): 'Root' {
        return 'Root';
    }

    override get level() {
        return 0;
    }
}
