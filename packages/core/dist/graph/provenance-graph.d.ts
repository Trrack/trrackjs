import { RootNode } from './components';
import { ProvenanceGraphAction } from './graph-slice';
export type Trigger = 'traversal' | 'new';
export type CurrentChangeHandler = (trigger?: Trigger) => void;
export type CurrentChangeHandlerConfig = {
    skipOnNew: boolean;
};
export type UnsubscribeCurrentChangeListener = () => void;
export type ProvenanceGraphStore = ReturnType<typeof f>;
declare const f: () => {
    addMetadata: import("..").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        meta: Record<string, unknown>;
    }, "provenance-graph/addMetadata">;
    addArtifact: import("..").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        artifact: unknown;
    }, "provenance-graph/addArtifact">;
    changeCurrent: import("..").ActionCreatorWithPayload<import("./components").NodeId, "provenance-graph/changeCurrent">;
    addNode: import("..").ActionCreatorWithPayload<import("./components").StateNode<any, any>, "provenance-graph/addNode">;
    load: import("..").ActionCreatorWithPayload<import("./graph-slice").ProvenanceGraph<any, any>, "provenance-graph/load">;
    initialState: import("./graph-slice").ProvenanceGraph<any, any>;
    backend: import("./graph-slice").ProvenanceGraph<any, any>;
    current: import("./components").ProvenanceNode<any, any>;
    root: RootNode<any>;
    currentChange(func: CurrentChangeHandler, config: CurrentChangeHandlerConfig): UnsubscribeCurrentChangeListener;
    update: (action: ProvenanceGraphAction<any, any>) => import("..").PayloadAction<{
        id: import("./components").NodeId;
        meta: Record<string, unknown>;
    }, "provenance-graph/addMetadata"> | import("..").PayloadAction<{
        id: import("./components").NodeId;
        artifact: unknown;
    }, "provenance-graph/addArtifact"> | import("..").PayloadAction<import("./components").NodeId, "provenance-graph/changeCurrent"> | import("..").PayloadAction<import("./components").StateNode<any, any>, "provenance-graph/addNode"> | import("..").PayloadAction<import("./graph-slice").ProvenanceGraph<any, any>, "provenance-graph/load">;
};
export declare function initializeProvenanceGraph<State, Event extends string>(initialState: State): {
    addMetadata: import("..").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        meta: Record<string, unknown>;
    }, "provenance-graph/addMetadata">;
    addArtifact: import("..").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        artifact: unknown;
    }, "provenance-graph/addArtifact">;
    changeCurrent: import("..").ActionCreatorWithPayload<import("./components").NodeId, "provenance-graph/changeCurrent">;
    addNode: import("..").ActionCreatorWithPayload<import("./components").StateNode<State, Event>, "provenance-graph/addNode">;
    load: import("..").ActionCreatorWithPayload<import("./graph-slice").ProvenanceGraph<State, Event>, "provenance-graph/load">;
    initialState: import("./graph-slice").ProvenanceGraph<State, Event>;
    backend: import("./graph-slice").ProvenanceGraph<State, Event>;
    current: import("./components").ProvenanceNode<State, Event>;
    root: RootNode<State>;
    currentChange(func: CurrentChangeHandler, config: CurrentChangeHandlerConfig): UnsubscribeCurrentChangeListener;
    update: (action: ProvenanceGraphAction<State, Event>) => import("..").PayloadAction<{
        id: import("./components").NodeId;
        meta: Record<string, unknown>;
    }, "provenance-graph/addMetadata"> | import("..").PayloadAction<{
        id: import("./components").NodeId;
        artifact: unknown;
    }, "provenance-graph/addArtifact"> | import("..").PayloadAction<import("./components").NodeId, "provenance-graph/changeCurrent"> | import("..").PayloadAction<import("./components").StateNode<State, Event>, "provenance-graph/addNode"> | import("..").PayloadAction<import("./graph-slice").ProvenanceGraph<State, Event>, "provenance-graph/load">;
};
export {};
