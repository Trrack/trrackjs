import { IActionNode, IProvenanceNode, IStateNode } from './types';

export class NodeUtils {
    static isAction<TState = any>(
        node: IProvenanceNode
    ): node is IActionNode<TState> {
        return node.type === 'Action';
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
