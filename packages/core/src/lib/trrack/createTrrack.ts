/* eslint-disable @typescript-eslint/no-explicit-any */
import { CombinedType, TrrackPlugin } from '../plugins';
import { Trrack, TrrackConfiguration } from './types';

function _createTrrack<State>(_initialState: State): Trrack<State> {
  const _state: State = _initialState;

  const trrack: Trrack<State> = {
    __backend: {
      registry: {},
      graph: {},
    },
    get initialState() {
      return _initialState;
    },
    get state() {
      return _state;
    },
    reset() {
      throw new Error('Not implemented1');
    },
    get current() {
      throw new Error('Not implemented2');
      return {} as Node;
    },
    get root() {
      throw new Error('Not implemented3');
      return {} as Node;
    },
    to(node: Node) {
      throw new Error('Not implemented4');
      node;
      return Promise.resolve();
    },
    undo() {
      throw new Error('Not implemented5');
      return Promise.resolve();
    },
    redo() {
      throw new Error('Not implemented6');
      return Promise.resolve();
    },
  };

  return trrack;
}

export function createTrrack<
  State,
  TrrackPlugins extends Array<TrrackPlugin<State, any>>
>(opts: TrrackConfiguration<State, TrrackPlugins>) {
  const { initialState, plugins = [] } = opts;

  const trrack = _createTrrack(initialState);

  plugins.forEach((plugin) => {
    Object.assign(trrack, plugin(trrack));
  });

  return trrack as Trrack<State> & CombinedType<TrrackPlugins>;
}
