import { IActionNode, IBaseActionNode, IInverseActionNode, IProvenanceNode, IRootNode, IStateNode } from './types';

export class NodeUtils {
    static isAnyAction<TState = any>(
        node: IProvenanceNode
    ): node is IBaseActionNode<TState> {
        return node.type === 'Action';
    }

    static isAction<TState>(
        node: IProvenanceNode
    ): node is IActionNode<TState> {
        if (NodeUtils.isAnyAction(node)) return !node.isInverse;

        return false;
    }

    static isInverseAction<TState = any>(
        node: IProvenanceNode
    ): node is IInverseActionNode<TState> {
        if (NodeUtils.isAnyAction<TState>(node)) return node.isInverse;

        return false;
    }

    static isRoot<TState = any>(
        node: IProvenanceNode
    ): node is IRootNode<TState> {
        return node.type === 'Root';
    }

    static isState<TState = any>(
        node: IProvenanceNode
    ): node is IStateNode<TState> {
        return node.type === 'State';
    }

    private constructor() {
        return;
    }
}
