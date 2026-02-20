import { PayloadAction, Slice } from '@reduxjs/toolkit';
import { NodeId, Nodes, StateNode } from './components';
type AddMetadataPayload = {
    id: NodeId;
    meta: Record<string, unknown>;
};
type AddArtifactPayload = {
    id: NodeId;
    artifact: unknown;
};
export type ProvenanceGraph<State, Event extends string> = {
    nodes: Nodes<State, Event>;
    current: NodeId;
    root: NodeId;
};
type GraphSlice<S, E extends string> = Slice<ProvenanceGraph<S, E>>;
export type ProvenanceGraphActions<S, E extends string> = GraphSlice<S, E>['actions'];
export declare function graphSliceCreator<State, Event extends string>(initialState: State, args?: {
    artifact?: unknown;
    metadata?: Record<string, unknown>;
    rootLabel?: string;
}): Slice<ProvenanceGraph<State, Event>, {
    addMetadata(g: import("immer/dist/internal").WritableDraft<ProvenanceGraph<State, Event>>, action: PayloadAction<AddMetadataPayload>): void;
    addArtifact(g: import("immer/dist/internal").WritableDraft<ProvenanceGraph<State, Event>>, action: PayloadAction<AddArtifactPayload>): void;
    changeCurrent(g: import("immer/dist/internal").WritableDraft<ProvenanceGraph<State, Event>>, action: PayloadAction<NodeId>): void;
    addNode(g: import("immer/dist/internal").WritableDraft<ProvenanceGraph<State, Event>>, { payload }: PayloadAction<StateNode<State, Event>>): void;
    load(_: import("immer/dist/internal").WritableDraft<ProvenanceGraph<State, Event>>, { payload }: PayloadAction<ProvenanceGraph<State, Event>>): ProvenanceGraph<State, Event>;
}, "provenance-graph">;
export {};
