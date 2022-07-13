import { INonRootNode, IProvenanceNode } from './types';

export class NodeUtils {
    static isRoot<T extends string>(
        node: IProvenanceNode<T>
    ): node is INonRootNode<T> {
        return node.type === 'Root';
    }

    static isNonRoot<T extends string>(
        node: IProvenanceNode<T>
    ): node is INonRootNode<T> {
        return node.type !== 'Root';
    }

    static isAction<T extends string>(
        node: IProvenanceNode<T>
    ): node is INonRootNode<T> {
        return node.type === 'Action';
    }

    static isState<T extends string>(
        node: IProvenanceNode<T>
    ): node is INonRootNode<T> {
        return node.type === 'State';
    }

    private constructor() {
        return;
    }
}
