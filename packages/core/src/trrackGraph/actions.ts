import { produce, castDraft } from 'immer';
import { NodeId, RootNode, StateNode } from './components';
import { TrrackGraph } from './types';
import { ID } from '../utils';

export function createTrrackGraph<State, Event extends string>(
    root: RootNode<State>
) {
    const graph: TrrackGraph<State, Event> = {
        root: root.id,
        current: root.id,
        nodes: {
            [root.id]: root,
        },
    };

    return graph;
}

export function addMetadataToNode<State, Event extends string>(
    graph: TrrackGraph<State, Event>,
    id: NodeId,
    newMetadata: Record<string, unknown>
) {
    return produce(graph, (draft) => {
        const existingMetadata = draft.nodes[id].meta;

        const metadata = Object.keys(newMetadata).reduce((acc, key) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                type: key,
                id: ID.get(),
                val: newMetadata[key],
                createdOn: Date.now(),
            });
            return acc;
        }, existingMetadata);

        draft.nodes[id].meta = metadata;
    });
}

export function changeCurrentInTrrackGraph<State, Event extends string>(
    graph: TrrackGraph<State, Event>,
    id: NodeId
) {
    return produce(graph, (draft) => {
        draft.current = id;
    });
}

export function addNodeToTrrackGraph<State, Event extends string>(
    graph: TrrackGraph<State, Event>,
    node: StateNode<State, Event>
) {
    return produce(graph, (draft) => {
        draft.nodes[node.id] = castDraft(node);
        draft.nodes[node.parent].children.push(node.id);
        draft.current = node.id;
    });
}

export function loadTrrackGraph<State, Event extends string>(
    graph: TrrackGraph<State, Event>,
    newGraph: TrrackGraph<State, Event>
) {
    return produce(graph, (draft) => {
        draft.current = newGraph.current;
        draft.root = newGraph.root;
        draft.nodes = castDraft(newGraph.nodes);
    });
}
