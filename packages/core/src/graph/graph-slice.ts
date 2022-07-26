import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ID } from '../utils';
import { NodeId, Nodes, RootNode, StateNode } from './components';

type ProvenanceGraph<S> = {
    nodes: Nodes<S>;
    current: NodeId;
    root: NodeId;
};

export function graphSliceCreator<S>(initialState: S) {
    const root: RootNode<S> = {
        id: ID.get(),
        label: 'Root',
        children: [],
        createdOn: Date.now(),
        state: {
            type: 'checkpoint',
            val: initialState,
        },
        level: 0,
    };

    const graph: ProvenanceGraph<S> = {
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
            addNode(g, { payload }: PayloadAction<StateNode<S>>) {
                g.nodes[payload.id] = payload as any;
                g.nodes[payload.parent].children.push(payload.id);
                g.current = payload.id;
            },
        },
    });
}
