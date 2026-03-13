import { PayloadActionCreator } from '../action';
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
type GraphActionCreators<S, E extends string> = {
    addMetadata: PayloadActionCreator<AddMetadataPayload, 'provenance-graph/addMetadata'>;
    addArtifact: PayloadActionCreator<AddArtifactPayload, 'provenance-graph/addArtifact'>;
    changeCurrent: PayloadActionCreator<NodeId, 'provenance-graph/changeCurrent'>;
    addNode: PayloadActionCreator<StateNode<S, E>, 'provenance-graph/addNode'>;
    load: PayloadActionCreator<ProvenanceGraph<S, E>, 'provenance-graph/load'>;
};
export type ProvenanceGraphActions<S, E extends string> = GraphActionCreators<S, E>;
export type ProvenanceGraphAction<S, E extends string> = ReturnType<GraphActionCreators<S, E>['addMetadata']> | ReturnType<GraphActionCreators<S, E>['addArtifact']> | ReturnType<GraphActionCreators<S, E>['changeCurrent']> | ReturnType<GraphActionCreators<S, E>['addNode']> | ReturnType<GraphActionCreators<S, E>['load']>;
export declare function graphSliceCreator<State, Event extends string>(initialState: State, args?: {
    artifact?: unknown;
    metadata?: Record<string, unknown>;
    rootLabel?: string;
}): {
    actions: GraphActionCreators<State, Event>;
    getInitialState(): ProvenanceGraph<State, Event>;
    reduce: (g: ProvenanceGraph<State, Event>, action: ProvenanceGraphAction<State, Event>) => ProvenanceGraph<State, Event>;
};
export {};
