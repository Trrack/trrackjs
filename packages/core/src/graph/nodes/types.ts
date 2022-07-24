import { Patch } from 'immer';

import { ApplyActionObject } from '../../provenance';

export type NodeType = 'Root' | 'State' | 'Action';

/**
 * Generic provenance node
 */
export interface IProvenanceNode {
    readonly id: string;
    readonly createdOn: Date;
    readonly type: NodeType;
    readonly label: string;
}

export type StateLike<T> =
    | {
          type: 'state';
          val: T;
      }
    | {
          type: 'patches';
          val: Patch[];
      };
export interface IRootNode<TState> extends IProvenanceNode {
    readonly state: PromiseLike<StateLike<TState>>;
    readonly level: number;
    readonly children: Array<IStateNode<TState>>;
    actionToChild(child: IStateNode<TState>): IActionNode<TState>;
    addChildNode(child: IStateNode<TState>, action: IActionNode<TState>): void;
}

export interface IStateNode<TState> extends IRootNode<TState> {
    parent: IStateNode<TState>;
    actionToParent: IInverseActionNode<TState>;
}

export interface IBaseActionNode<TState> extends IProvenanceNode {
    readonly record: ApplyActionObject<any, any>;
    readonly isInverse: boolean;
    readonly hasSideEffects: boolean;
    result: IStateNode<TState> | IRootNode<TState>;
    readonly triggeredBy: IStateNode<TState> | IRootNode<TState>;
}

export interface IActionNode<TState> extends IBaseActionNode<TState> {
    inverseAction: IInverseActionNode<TState>;
}

export interface IInverseActionNode<TState> extends IBaseActionNode<TState> {
    invertsAction: IActionNode<TState>;
}
