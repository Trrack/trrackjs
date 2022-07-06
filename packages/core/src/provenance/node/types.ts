import { AGraphNode, IGraphNode } from '../../graph';
import { TrrackAction } from '../action/types';

type NodeType = 'Root' | 'State' | 'Action';

export interface IProvenanceNode extends IGraphNode {
    readonly type: NodeType;
    readonly label: string;
    readonly children: IProvenanceNode[];
    readonly level: number;
}

export interface IRootNode extends Omit<IProvenanceNode, 'parent'> {
    readonly type: 'Root';
}

export interface INonRootNode extends IProvenanceNode {
    readonly parent: IProvenanceNode;
}

export interface IActionNode extends INonRootNode {
    readonly type: 'Action';
    readonly parent: IProvenanceNode;
    readonly action: TrrackAction<any, any, any, any>;
}

export interface IStateNode extends INonRootNode {
    readonly type: 'State';
    readonly parent: IProvenanceNode;
}

export class ProvenanceNodeUtils {
    static isRoot(node: IProvenanceNode): node is IRootNode {
        return node.type === 'Root';
    }

    static isAction(node: IProvenanceNode): node is IActionNode {
        return node.type === 'Action';
    }

    static isState(node: IProvenanceNode): node is IStateNode {
        return node.type === 'State';
    }

    private constructor() {
        throw new Error(
            'ProvenanceNodeUtils only contains static methods.\nInstance of ProvenanceNodeUtils is not required, please use static methods directly.'
        );
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
        if (!this.incoming || this.incoming.length === 0)
            throw new Error('No parents detected.');
        if (this.incoming.length > 1)
            throw new Error('Multiple parents detected.');

        return <IProvenanceNode>this.incoming[0];
    }

    get children() {
        return <IProvenanceNode[]>this.outgoing;
    }

    get level() {
        return this.parent.level + 1;
    }
}
