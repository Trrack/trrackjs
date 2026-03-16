/* eslint-disable @typescript-eslint/no-explicit-any */
import produce, { freeze } from 'immer';
import {
    ActionCreatorWithPayload,
    createAction,
} from '../action';
import { ID } from '../utils';
import { createRootNode, NodeId, Nodes, StateNode } from './components';

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

export type ProvenanceGraphActions<S, E extends string> = {
    addMetadata: ActionCreatorWithPayload<
        AddMetadataPayload,
        'provenance-graph/addMetadata'
    >;
    addArtifact: ActionCreatorWithPayload<
        AddArtifactPayload,
        'provenance-graph/addArtifact'
    >;
    changeCurrent: ActionCreatorWithPayload<
        NodeId,
        'provenance-graph/changeCurrent'
    >;
    addNode: ActionCreatorWithPayload<
        StateNode<S, E>,
        'provenance-graph/addNode'
    >;
    load: ActionCreatorWithPayload<
        ProvenanceGraph<S, E>,
        'provenance-graph/load'
    >;
};

export type ProvenanceGraphAction<S, E extends string> = ReturnType<
    ProvenanceGraphActions<S, E>[keyof ProvenanceGraphActions<S, E>]
>;

type PublicGraphSlice<S, E extends string> = {
    actions: ProvenanceGraphActions<S, E>;
    getInitialState: () => ProvenanceGraph<S, E>;
    reduce: (
        state: ProvenanceGraph<S, E>,
        action: ProvenanceGraphAction<S, E>
    ) => ProvenanceGraph<S, E>;
};

// Maybe swithc to reduxtoolkit createEntityAdapter

export function graphSliceCreator<State, Event extends string>(
    initialState: State,
    args: {
        artifact?: unknown;
        metadata?: Record<string, unknown>;
        rootLabel?: string;
    } = {}
): PublicGraphSlice<State, Event> {
    const {
        artifact = undefined,
        metadata = undefined,
        rootLabel = 'Root',
    } = args;

    const root = createRootNode<State>({
        state: initialState,
        label: rootLabel,
        initialArtifact: artifact,
        initialMetadata: metadata,
    });

    const graph: ProvenanceGraph<State, Event> = {
        nodes: {
            [root.id]: root,
        },
        root: root.id,
        current: root.id,
    };

    const actions: ProvenanceGraphActions<State, Event> = {
        addMetadata: createAction<
            AddMetadataPayload,
            'provenance-graph/addMetadata'
        >(
            'provenance-graph/addMetadata'
        ),
        addArtifact: createAction<
            AddArtifactPayload,
            'provenance-graph/addArtifact'
        >(
            'provenance-graph/addArtifact'
        ),
        changeCurrent: createAction<
            NodeId,
            'provenance-graph/changeCurrent'
        >('provenance-graph/changeCurrent'),
        addNode: createAction<
            StateNode<State, Event>,
            'provenance-graph/addNode'
        >(
            'provenance-graph/addNode'
        ),
        load: createAction<
            ProvenanceGraph<State, Event>,
            'provenance-graph/load'
        >(
            'provenance-graph/load'
        ),
    };

    const frozenGraph = freeze(graph, true);

    return {
        actions,
        getInitialState: () => frozenGraph,
        reduce(g, action) {
            switch (action.type) {
                case actions.addMetadata.type:
                    return produce(g, (draft) => {
                        const { id, meta } = action.payload;
                        const existingMetadata = draft.nodes[id].meta;

                        const metaData = Object.keys(meta).reduce(
                            (acc, key) => {
                                if (!acc[key]) {
                                    acc[key] = [];
                                }

                                acc[key].push({
                                    type: key,
                                    id: ID.get(),
                                    val: meta[key],
                                    createdOn: Date.now(),
                                });

                                return acc;
                            },
                            existingMetadata
                        );

                        draft.nodes[id].meta = metaData;
                    });
                case actions.addArtifact.type:
                    return produce(g, (draft) => {
                        draft.nodes[action.payload.id].artifacts.push({
                            id: ID.get(),
                            createdOn: Date.now(),
                            val: action.payload.artifact as any,
                        });
                    });
                case actions.changeCurrent.type:
                    return produce(g, (draft) => {
                        draft.current = action.payload;
                    });
                case actions.addNode.type:
                    return produce(g, (draft) => {
                        const { payload } = action;
                        draft.nodes[payload.id] = payload as any;
                        draft.nodes[payload.parent].children.push(payload.id);
                        draft.current = payload.id;
                    });
                case actions.load.type:
                    return freeze(action.payload, true);
                default:
                    return g;
            }
        },
    };
}
