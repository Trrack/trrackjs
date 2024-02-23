import { createActionRegistry } from '../actions/api';
import { castImmutable, enablePatches } from 'immer';
import { ConfigureTrrackOptions, Trrack } from './trrack.types';
import { createProvenanceGraphManager } from '../graph/manager';

enablePatches();

export function createTrrack<State>(
  opts: ConfigureTrrackOptions<State>
): Trrack<State> {
  const { initialState, registry = createActionRegistry() } = opts;
  const provenanceGraphManager = createProvenanceGraphManager(initialState);

  return {
    __unsafe: {},
    __backend: {
      registry,
      graph() {
        return castImmutable(provenanceGraphManager.getGraph());
      },
    },
    getInitialState() {
      return initialState;
    },
    getState(node) {},
    current: {},
    root: {},
    to(node) {},
    undo() {},
    redo(to) {},
    //
  };
}
