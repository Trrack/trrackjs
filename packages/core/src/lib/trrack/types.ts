/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { TrrackPlugin } from '../plugins';

type SideEffectRegistry = any;
type ProvenanceGraph<State> = State & any;

export type TrrackCreator<State, Api = {}> = (
  state: State
) => Trrack<State> & Api;

export type Trrack<State> = {
  __backend: {
    registry: SideEffectRegistry;
    graph: ProvenanceGraph<State>;
  };
  initialState: State;
  state: State;
  reset(): void; // not sure
  current: Node;
  root: Node;
  to(node: Node): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
};

export type TrrackConfiguration<
  State,
  TrrackPlugins extends Array<TrrackPlugin<State, any>>
> = {
  initialState: State;
  registry?: SideEffectRegistry;
  plugins?: [...TrrackPlugins];
};
