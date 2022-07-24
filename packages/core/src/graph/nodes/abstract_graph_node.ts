import { ID } from '../../utils';
import { IProvenanceNode, NodeType } from './types';

export abstract class AProvenanceNode implements IProvenanceNode {
    abstract type: NodeType;
    readonly id: string = ID.get();
    readonly createdOn: Date = new Date();

    constructor(public readonly label: string) {}
}
