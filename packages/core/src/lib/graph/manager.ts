import { castDraft, produce } from 'immer';
import { createRootNode } from './nodes';
import { ProvenanceGraph, ProvenanceGraphManager } from './node.types';

/**
 * Creates a manager for a provenance graph.
 * The manager provides methods for retrieving, modifying, and loading a graph.
 *
 * @template State - The type of the state.
 * @template Event - The type of the event.
 *
 * @param {Immutable<State>} initialState - The initial state of the graph.
 *
 * @returns {ProvenanceGraphManager<State>} A manager for the provenance graph.
 */
export function createProvenanceGraphManager<State>(
  initialState: State,
  rootLabel?: string
): ProvenanceGraphManager<State> {
  const root = createRootNode({
    initialState,
    label: rootLabel ? rootLabel : 'Root',
  });

  const _graph: ProvenanceGraph<State> = {
    nodes: {
      [root.id]: root,
    },
    current: root.id,
    root: root.id,
  };

  let graph = produce(_graph, (draft) => {
    return draft;
  });

  return {
    getGraph() {
      return graph;
    },
    addNode(node) {
      graph = produce<ProvenanceGraph<State>>(graph, (draft) => {
        draft.nodes[node.id] = castDraft(node);
        draft.nodes[node.parent].children.push(node.id);
        draft.current = node.id;
      });

      return Promise.resolve();
    },
    changeCurrentNode(id) {
      graph = produce(graph, (draft) => {
        draft.current = id;
      });
      return Promise.resolve();
    },
    load(newGraph) {
      graph = produce(graph, () => {
        return newGraph;
      });

      return Promise.resolve();
    },
  };
}
