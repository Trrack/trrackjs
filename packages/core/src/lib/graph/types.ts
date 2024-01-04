import { ActionId, AuthorId, NodeId } from '../ids/types';
import { Operation } from 'fast-json-patch';

/**
 * Represents full snapshot of the state.
 * @template State - The type of the state.
 */
export type StateSnapshot<State> = {
  type: 'snapshot'; // Indicates a snapshot state
  state: State; // The actual state snapshot
};

/**
 * Represents diff from the previous snapshot node
 */
export type StateDiff = {
  type: 'diff'; // Indicates a diff state
  lastSnapshotNodeId: NodeId; // NodeId of the last full snapshot node
  diffs: Array<Operation>; // Array of operations representing the state diffs
};

/**
 * Represents either a state snapshot or diffs from previous snapshot.
 * @template State - The type of the state.
 */
export type StateLike<State> = StateSnapshot<State> | StateDiff;

/**
 * Represents the base node type containing common properties for all nodes.
 * @template Event - The type of the event.
 */
type BaseNode = {
  id: NodeId; // Unique identifier for the node
  createdOn: string; // Timestamp when the node was created
  spec_version: string; // Version identifier for the state
  author: AuthorId; // Author or user ID who created the node
  label: string; // Label or name for the node (e.g., state name)
  event: string;
  children: NodeId[];
};

/**
 * Adds parent id key to the base node type
 * @template Event - The type of the event.
 */
type BaseNonRootNode = BaseNode & {
  parent: NodeId; // Parent node ID
};

/**
 * Represents a base state node.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
type BaseStateNode<State> = BaseNode & {
  stateLike: StateLike<State>; // State snapshot or diff representation
};

/**
 * Represents the root node in the graph structure.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type RootNode<State> = BaseStateNode<State>;

/**
 * Represents a state node in the graph structure.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type StateNode<State> = RootNode<State> & BaseNonRootNode;

/**
 * Represents an action for an `ActionNode`
 */
export type ActionRecord<
  DoArgs extends unknown[] = unknown[],
  UndoArgs extends unknown[] = unknown[]
> = {
  do: {
    id: ActionId;
    args: DoArgs;
  };
  undo: {
    id: ActionId;
    args: UndoArgs[];
  };
};

/**
 * Represents an action node with an associated action.
 * @template Event - The type of the event.
 */
export type ActionNode<State> = BaseNonRootNode &
  BaseStateNode<State> & {
    actionRecord: ActionRecord;
  };

/**
 * Represents a node in the provenance graph, which can be a root node, an action node, or a state node.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type ProvenanceNode<State> =
  | RootNode<State>
  | ActionNode<State>
  | StateNode<State>;

/**
 * Represents a collection of nodes indexed by NodeId in the provenance graph.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type Nodes<State> = Record<NodeId, ProvenanceNode<State>>;

/**
 * Represents the entire provenance graph, including nodes and references to the current and root nodes.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type ProvenanceGraph<State> = {
  nodes: Nodes<State>;
  current: NodeId;
  root: NodeId;
};

/**
 * Represents a manager for handling operations on a ProvenanceGraph.
 * This manager provides methods for retrieving, modifying, and loading a graph.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type ProvenanceGraphManager<State> = {
  getGraph(): ProvenanceGraph<State>;
  changeCurrentNode(id: NodeId): Promise<void>;
  addNode(node: StateNode<State> | ActionNode<State>): Promise<void>;
  load(graph: ProvenanceGraph<State>): Promise<void>;
};

/**
 * Options for creating a root node.
 * @template State - The type of the state.
 */
export type CreateRootNodeOptions<State> = {
  initialState: State;
  label?: string;
};

/**
 * Options for creating a state node.
 * @template State - The type of the state.
 * @template Event - The type of the event.
 */
export type CreateStateNodeOptions<State> = {
  parent: RootNode<State> | ProvenanceNode<State>;
  stateLike: StateLike<State>;
  label: string;
  event: string;
};
