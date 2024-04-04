/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { BrandedId } from '../../utils/branded_types';
import { Operation } from 'fast-json-patch';

export type NodeId = BrandedId<string, 'Node'>;
export type AuthorId = BrandedId<string, 'Author'>;

export type StateSnapshot<State> = {
  type: 'state:snapshot';
  state: State;
};

export type StateDiff = {
  type: 'state:diff';
  lastSnapShotNodeId: NodeId;
  diffs: Array<Operation>;
};

export type ActionRecord = {
  actionName: string;
  args: any[];
};

export type SideEffect = {
  type: 'sideeffect';
  do: ActionRecord;
  undo: ActionRecord;
};

export type BaseMetadata = {
  createdOn: string;
  specVersion: string;
  author: AuthorId;
};

export type BaseNode<Metadata> = {
  __root: boolean;
  __nodeType: 'snapshot' | 'diff' | 'sideeffect';
  hash: string;
  id: NodeId;
  label: string;
  type: string;
  children: NodeId[];
  metadata: BaseMetadata & Metadata;
};

export type RootNode<State, Metadata = {}> = BaseNode<Metadata> & {
  payload: StateSnapshot<State>;
};

export type NodeWithParent<Metadata> = BaseNode<Metadata> & {
  parent: NodeId;
};

export type SnapshotNode<State, Metadata = {}> = NodeWithParent<Metadata> & {
  payload: StateSnapshot<State>;
};

export type DiffNode<Metadata = {}> = NodeWithParent<Metadata> & {
  payload: StateDiff;
};

export type StateNode<State, Metadata = {}> =
  | SnapshotNode<State, Metadata>
  | DiffNode<Metadata>;

export type SideEffectNode<Metadata = {}> = BaseNode<Metadata> & {
  payload: SideEffect;
};

export type ChildNode<State, Metadata = {}> =
  | StateNode<State, Metadata>
  | SideEffectNode<Metadata>;

export type TrrackNode<State, Metadata = {}> =
  | RootNode<State, Metadata>
  | ChildNode<State, Metadata>;

export type TrrackNodes<State, Metadata = {}> = Record<
  NodeId,
  TrrackNode<State, Metadata>
>;

export type TrrackNodeList<State, Metadata = {}> = Array<
  TrrackNode<State, Metadata>
>;
