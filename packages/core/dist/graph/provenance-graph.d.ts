import { RootNode } from './components';
export type Trigger = 'traversal' | 'new';
export type CurrentChangeHandler = (trigger?: Trigger) => void;
export type CurrentChangeHandlerConfig = {
    skipOnNew: boolean;
};
export type UnsubscribeCurrentChangeListener = () => boolean;
export type ProvenanceGraphStore = ReturnType<typeof f>;
declare const f: () => {
    addMetadata: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        meta: Record<string, unknown>;
    }, "provenance-graph/addMetadata">;
    addArtifact: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        artifact: unknown;
    }, "provenance-graph/addArtifact">;
    changeCurrent: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("./components").NodeId, "provenance-graph/changeCurrent">;
    addNode: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("./components").StateNode<any, any>, "provenance-graph/addNode">;
    load: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("./graph-slice").ProvenanceGraph<any, any>, "provenance-graph/load">;
    initialState: import("./graph-slice").ProvenanceGraph<any, any>;
    backend: import("./graph-slice").ProvenanceGraph<any, any>;
    current: import("./components").ProvenanceNode<any, any>;
    root: RootNode<any>;
    currentChange(func: CurrentChangeHandler, config: CurrentChangeHandlerConfig): UnsubscribeCurrentChangeListener;
    update: ((action: import("redux").Action<"listenerMiddleware/add">) => import("@reduxjs/toolkit").UnsubscribeListener) & import("@reduxjs/toolkit").ThunkDispatch<import("./graph-slice").ProvenanceGraph<any, any>, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
};
export declare function initializeProvenanceGraph<State, Event extends string>(initialState: State): {
    addMetadata: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        meta: Record<string, unknown>;
    }, "provenance-graph/addMetadata">;
    addArtifact: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
        id: import("./components").NodeId;
        artifact: unknown;
    }, "provenance-graph/addArtifact">;
    changeCurrent: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("./components").NodeId, "provenance-graph/changeCurrent">;
    addNode: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("./components").StateNode<State, Event>, "provenance-graph/addNode">;
    load: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("./graph-slice").ProvenanceGraph<State, Event>, "provenance-graph/load">;
    initialState: import("./graph-slice").ProvenanceGraph<State, Event>;
    backend: import("./graph-slice").ProvenanceGraph<State, Event>;
    current: import("./components").ProvenanceNode<State, Event>;
    root: RootNode<State>;
    currentChange(func: CurrentChangeHandler, config: CurrentChangeHandlerConfig): UnsubscribeCurrentChangeListener;
    update: ((action: import("redux").Action<"listenerMiddleware/add">) => import("@reduxjs/toolkit").UnsubscribeListener) & import("@reduxjs/toolkit").ThunkDispatch<import("./graph-slice").ProvenanceGraph<State, Event>, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
};
export {};
