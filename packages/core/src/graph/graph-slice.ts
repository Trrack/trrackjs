/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepClone } from 'fast-json-patch';
import { PayloadActionCreator, createAction } from '../action';
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

type GraphActionCreators<S, E extends string> = {
    addMetadata: PayloadActionCreator<
        AddMetadataPayload,
        'provenance-graph/addMetadata'
    >;
    addArtifact: PayloadActionCreator<
        AddArtifactPayload,
        'provenance-graph/addArtifact'
    >;
    changeCurrent: PayloadActionCreator<NodeId, 'provenance-graph/changeCurrent'>;
    addNode: PayloadActionCreator<
        StateNode<S, E>,
        'provenance-graph/addNode'
    >;
    load: PayloadActionCreator<
        ProvenanceGraph<S, E>,
        'provenance-graph/load'
    >;
};

export type ProvenanceGraphActions<S, E extends string> = GraphActionCreators<
    S,
    E
>;

export type ProvenanceGraphAction<S, E extends string> =
    | ReturnType<GraphActionCreators<S, E>['addMetadata']>
    | ReturnType<GraphActionCreators<S, E>['addArtifact']>
    | ReturnType<GraphActionCreators<S, E>['changeCurrent']>
    | ReturnType<GraphActionCreators<S, E>['addNode']>
    | ReturnType<GraphActionCreators<S, E>['load']>;

export function cloneGraph<State, Event extends string>(
    graph: ProvenanceGraph<State, Event>
): ProvenanceGraph<State, Event> {
    return deepClone(graph) as ProvenanceGraph<State, Event>;
}

export function graphSliceCreator<State, Event extends string>(
    initialState: State,
    args: {
        artifact?: unknown;
        metadata?: Record<string, unknown>;
        rootLabel?: string;
    } = {}
) {
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

    const actions: GraphActionCreators<State, Event> = {
        addMetadata: createAction<
            AddMetadataPayload,
            'provenance-graph/addMetadata'
        >('provenance-graph/addMetadata'),
        addArtifact: createAction<
            AddArtifactPayload,
            'provenance-graph/addArtifact'
        >('provenance-graph/addArtifact'),
        changeCurrent: createAction<
            NodeId,
            'provenance-graph/changeCurrent'
        >('provenance-graph/changeCurrent'),
        addNode: createAction<StateNode<State, Event>, 'provenance-graph/addNode'>(
            'provenance-graph/addNode'
        ),
        load: createAction<
            ProvenanceGraph<State, Event>,
            'provenance-graph/load'
        >('provenance-graph/load'),
    };

    function reduce(
        g: ProvenanceGraph<State, Event>,
        action: ProvenanceGraphAction<State, Event>
    ): ProvenanceGraph<State, Event> {
        if (actions.addMetadata.match(action)) {
            const { id, meta } = action.payload;
            const existingMetadata = g.nodes[id].meta;

            const metaData = Object.keys(meta).reduce((acc, key) => {
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
            }, existingMetadata);

            g.nodes[id].meta = metaData;
            return g;
        }

        if (actions.addArtifact.match(action)) {
            g.nodes[action.payload.id].artifacts.push({
                id: ID.get(),
                createdOn: Date.now(),
                val: action.payload.artifact,
            });
            return g;
        }

        if (actions.changeCurrent.match(action)) {
            g.current = action.payload;
            return g;
        }

        if (actions.addNode.match(action)) {
            const { payload } = action;
            g.nodes[payload.id] = payload as any;
            g.nodes[payload.parent].children.push(payload.id);
            g.current = payload.id;
            return g;
        }

        if (actions.load.match(action)) {
            return cloneGraph(action.payload);
        }

        return g;
    }

    return {
        actions,
        getInitialState() {
            return cloneGraph(graph);
        },
        reduce,
    };
}
