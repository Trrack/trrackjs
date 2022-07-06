import { AProvenanceNode, IRootNode } from './types';

export class RootNode extends AProvenanceNode implements IRootNode {
    static create(): IRootNode {
        return new RootNode();
    }

    type: 'Root' = 'Root';

    private constructor() {
        super('Root');
    }

    override get level() {
        return 0;
    }
}
