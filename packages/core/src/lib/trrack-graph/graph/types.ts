/* eslint-disable @typescript-eslint/ban-types */
import { Immutable } from 'immer';
import { NodeId, TrrackNodes } from '../nodes';

export type MutableTrrackGraph<State, Metadata = {}> = {
  nodes: TrrackNodes<State, Metadata>;
  current: NodeId;
  root: NodeId;
};

export type TrrackGraph<State, Metadata = {}> = Immutable<
  MutableTrrackGraph<State, Metadata>
>;
