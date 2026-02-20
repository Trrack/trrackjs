import { PayloadAction } from '@reduxjs/toolkit';
import { Operation } from 'fast-json-patch';
import { FlavoredId } from '../../utils';
export type NodeId = FlavoredId<string, 'Node'>;
type Checkpoint<State> = {
    type: 'checkpoint';
    val: State;
};
type Patches = {
    type: 'patch';
    checkpointRef: NodeId;
    val: Array<Operation>;
};
export type StateLike<State> = Checkpoint<State> | Patches;
/**
 * Node Artifact Type
 */
/**
 * Artifact Types
 */
export type ArtifactId = FlavoredId<string, 'Artifact'>;
export type Artifact = {
    id: ArtifactId;
    createdOn: number;
    val: unknown;
};
export type NodeArtifact = Array<Artifact>;
/**
 * Node Metadata Type
 */
export type MetadataId = FlavoredId<string, 'Metadata'>;
export type Metadata<T = unknown> = {
    id: MetadataId;
    type: string;
    createdOn: number;
    val: T;
};
type NodeMetadata = {
    annotation: Array<Metadata<string>>;
    bookmark: Array<Metadata<boolean>>;
    [key: string]: Array<Metadata<unknown>>;
};
/**
 * Node Types
 */
type BaseNode<State> = {
    label: string;
    id: NodeId;
    createdOn: number;
    artifacts: NodeArtifact;
    meta: NodeMetadata;
    children: NodeId[];
    state: StateLike<State>;
    level: number;
};
export type RootNode<State> = BaseNode<State> & {
    event: 'Root';
};
export type SideEffects = {
    do: Array<PayloadAction<any, any>>;
    undo: Array<PayloadAction<any, any>>;
};
export type StateNode<State, Event extends string> = BaseNode<State> & {
    event: Event;
    parent: NodeId;
    sideEffects: SideEffects;
};
export type ProvenanceNode<State, Event extends string> = RootNode<State> | StateNode<State, Event>;
export type Nodes<State, Event extends string> = Record<string, ProvenanceNode<State, Event>>;
export declare function isStateNode<State, Event extends string>(node: ProvenanceNode<State, Event>): node is StateNode<State, Event>;
export declare function isRootNode<State, Event extends string>(node: ProvenanceNode<State, Event>): node is RootNode<State>;
export declare function createRootNode<State>(args: {
    state: State;
    initialMetadata?: Record<string, unknown>;
    initialArtifact?: unknown;
    label?: string;
}): RootNode<State>;
export declare function createStateNode<State, Event extends string>({ parent, state, label, sideEffects, initialMetadata, initialArtifact, event, }: {
    parent: ProvenanceNode<State, Event>;
    state: StateLike<State>;
    initialMetadata?: Record<string, unknown>;
    initialArtifact?: unknown;
    label: string;
    sideEffects?: SideEffects;
    event: Event;
}): StateNode<State, Event>;
export {};
