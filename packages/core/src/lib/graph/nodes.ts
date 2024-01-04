import { getUUID } from '../ids/getUUID';
import { SPEC_VERSION } from '../trrack/version';
import {
  CreateRootNodeOptions,
  CreateStateNodeOptions,
  RootNode,
  StateNode,
} from './types';

// Default label for the root node
const DEFAULT_ROOT_LABEL = 'Root';

/**
 * Create a root node for the provenance graph.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 * @param {CreateRootNodeOptions<State>} options - The options for creating the root node.
 * @returns {RootNode} The created root node.
 */
export function createRootNode<State>({
  initialState,
  label = DEFAULT_ROOT_LABEL,
}: CreateRootNodeOptions<State>): RootNode<State> {
  return {
    id: getUUID(),
    label,
    stateLike: {
      type: 'snapshot',
      state: initialState,
    },
    createdOn: new Date().toISOString(),
    spec_version: SPEC_VERSION,
    event: 'Graph Creation',
    author: getUUID(),
    children: [],
  };
}

/**
 * Create a state node for the provenance graph.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 * @param {CreateStateNodeOptions<State>} options - The options for creating the state node.
 * @returns {StateNode<State>} The created state node.
 */
export function createStateNode<State>({
  stateLike,
  label,
  event,
  parent,
}: CreateStateNodeOptions<State>): StateNode<State> {
  return {
    id: getUUID(),
    author: getUUID(),
    parent: parent.id,
    label,
    event,
    stateLike,
    createdOn: new Date().toISOString(),
    spec_version: SPEC_VERSION,
    children: [],
  };
}
