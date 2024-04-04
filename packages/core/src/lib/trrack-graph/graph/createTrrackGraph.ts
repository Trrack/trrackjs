import { castImmutable, produce } from 'immer';
import { RootNode, createRootNode } from '../nodes';
import { MutableTrrackGraph, TrrackGraph } from './types';

export function createTrrackGraph<State, Metadata = {}>(
  initialState: State
): TrrackGraph<State, Metadata> {
  const emptyGraph: TrrackGraph<State, Metadata> = {
    nodes: {},
    root: '',
    current: '',
  };

  const graph = produce(
    emptyGraph,
    (draft, root: RootNode<State, Metadata>) => {
      draft.nodes[root.id] = root;
      draft.root = root.id;
      draft.current = root.id;
    }
  );

  return castImmutable({
    nodes: {
      [castImmutable(root.id)]: root,
    },
    current: root.id,
    root: root.id,
  });
}
