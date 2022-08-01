/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    BaseArtifactType,
    createRootNode,
    NodeId,
    Nodes,
    StateNode,
} from './components';

type ProvenanceGraph<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
> = {
    nodes: Nodes<State, Event, Artifact>;
    current: NodeId;
    root: NodeId;
};

// Maybe swithc to reduxtoolkit createEntityAdapter

export function graphSliceCreator<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
>(initialState: State, rootArtifact?: Artifact) {
    const root = createRootNode<State, Event, Artifact>({
        state: initialState,
        label: 'Root' as Event,
        artifact: rootArtifact,
    });

    const graph: ProvenanceGraph<State, Event, Artifact> = {
        nodes: {
            [root.id]: root,
        },
        root: root.id,
        current: root.id,
    };

    return createSlice({
        name: 'provenance-graph',
        initialState: graph,
        reducers: {
            changeCurrent(g, action: PayloadAction<NodeId>) {
                g.current = action.payload;
            },
            addNode(
                g,
                { payload }: PayloadAction<StateNode<State, Event, Artifact>>
            ) {
                g.nodes[payload.id] = payload as any;
                g.nodes[payload.parent].children.push(payload.id);
                g.current = payload.id;
            },
        },
    });
}
