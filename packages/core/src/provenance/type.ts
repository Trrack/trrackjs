import { IGraph, IStateNode, StateLike } from '../graph';
import { TrrackAction } from './action';

export interface IProvenanceGraph<TState> {
    readonly current: IStateNode<TState>;
    readonly backend: IGraph;
    readonly root: IStateNode<TState>;
    addAction(label: string, action: TrrackAction): void;
    addState(label: string, stateLike: StateLike<TState>): void;
    goTo(node: IStateNode<TState>): IStateNode<TState>[];
}
