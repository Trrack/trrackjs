import { Immutable } from 'immer';
import { ActionRegistry } from '../actions/action.types';
import { ProvenanceGraph, ProvenanceNode } from '../graph/node.types';
import { NodeId } from '../ids/ids.types';

export type RedoDirection = 'oldest' | 'latest';

export type TrrackUnsafeOptions = Record<string, unknown>;

export type TrrackBackend<State> = {
  registry: ActionRegistry<State>;
  graph(): Immutable<ProvenanceGraph<State>>;
};

export type Trrack<State> = {
  __unsafe: TrrackUnsafeOptions;
  __backend: TrrackBackend<State>;
  getInitialState(): State;
  getState(node?: ProvenanceNode<State> | NodeId): Immutable<State>;
  current: ProvenanceNode<State>;
  root: ProvenanceNode<State>;
  to(node: ProvenanceNode<State> | NodeId): Promise<void>;
  undo(): Promise<void>;
  redo(to?: RedoDirection): Promise<void>;
};

export type ConfigureTrrackOptions<State> = {
  initialState: State;
  registry?: ActionRegistry<State>;
};
