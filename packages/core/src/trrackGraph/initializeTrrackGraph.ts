import { ID } from '../utils';
import {
    addMetadataToNode,
    addNodeToTrrackGraph,
    changeCurrentInTrrackGraph,
    createTrrackGraph,
} from './actions';
import { RootNode, createRootNode } from './components';
import {
    ListenerEntry,
    Trigger,
    TrrackGraphManager,
    UnsubscribeCurrentChangeListener,
} from './types';

export function initializeTrrackGraph<State, Event extends string>(
    rootState: State,
    rootLabel = 'Trrack Initialized',
    metadata?: Record<string, unknown>
): TrrackGraphManager<State, Event> {
    const listeners = new Map<string, ListenerEntry>();

    const rootNode = createRootNode<State>({
        state: rootState,
        label: rootLabel,
        initialMetadata: metadata,
    });

    let graph = createTrrackGraph<State, Event>(rootNode);

    let executionId: string | null = null;

    function executeListeners(id: string, trigger: Trigger) {
        const _listeners = Array.from(listeners.values());
        executionId = id;

        for (let i = 0; i < _listeners.length; i++) {
            if (executionId !== id) return;

            const { fn, config } = _listeners[i];

            if (config.skipOnNew && trigger === 'new') continue;

            fn(trigger);
        }
    }

    return {
        get initialState() {
            return rootState;
        },
        get backend() {
            return graph;
        },
        get current() {
            return graph.nodes[graph.current];
        },
        get root() {
            return graph.nodes[graph.root] as RootNode<State>;
        },
        currrentChangeHandler(fn, config): UnsubscribeCurrentChangeListener {
            const id = ID.get();
            listeners.set(id, { id, fn, config });

            return () => listeners.delete(id);
        },
        changeCurrent(id) {
            graph = changeCurrentInTrrackGraph(graph, id);
            executeListeners(ID.get(), 'traversal');
        },
        addNode(node) {
            graph = addNodeToTrrackGraph(graph, node);
            executeListeners(ID.get(), 'new');
        },
        addMetadata(id, newMetadata) {
            graph = addMetadataToNode(graph, id, newMetadata);
            executeListeners(ID.get(), 'traversal');
        },
        load(newGraph) {
            graph = newGraph;
            executeListeners(ID.get(), 'traversal');
            return graph;
        },
    };
}
