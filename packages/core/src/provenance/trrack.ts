/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { applyPatch, compare, Operation } from 'fast-json-patch';

import { initEventManager } from '../event';
import {
    BaseArtifactType,
    createStateNode,
    initializeProvenanceGraph,
    isStateNode,
    NodeId,
    Nodes,
    ProvenanceNode,
    SideEffects,
    StateLike,
    StateNode,
} from '../graph';
import { ProvenanceGraph } from '../graph/graph-slice';
import { ProduceWrappedStateChangeFunction, Registry, TrrackActionFunction } from '../registry';

export enum TrrackEvents {
    TRAVERSAL_START = 'Traversal_Start',
    TRAVERSAL_END = 'Traversal_End',
}

type ConfigureTrrackOptions<State> = {
    registry: Registry<any>;
    initialState: State;
};

type RecordActionArgs<State, Event extends string> = {
    label: string;
    state: State;
    eventType: Event;
    sideEffects: SideEffects;
    onlySideEffects?: boolean;
};

function getState<State, Event extends string>(
    node: ProvenanceNode<State, Event, any>,
    nodes: Nodes<State, Event, any>
): State {
    const stateLike = node.state;
    if (stateLike.type === 'checkpoint') return stateLike.val;

    const { checkpointRef } = stateLike;
    const checkpointNode = nodes[checkpointRef];
    const path = getPath(checkpointNode, node, nodes);
    path.shift();
    const patches = path
        .map((p) => nodes[p])
        .map((n) => n.state.val as Operation[])
        .reduce((acc, patch) => [...acc, ...patch], []);

    const checkpointState = getState(checkpointNode, nodes);

    return applyPatch(checkpointState, patches, true, false).newDocument;
}

function determineSaveStrategy<T>(
    state: T,
    patches: Array<Operation>
): 'checkpoint' | 'patch' {
    const objectKeysLength = Object.keys(state).length;

    const uniquePatchesLength = new Set(
        patches.map((patch) => {
            return patch.path.split('/')[0];
        })
    ).size;

    if (uniquePatchesLength < objectKeysLength / 2) return 'patch';

    return 'checkpoint';
}

export function initializeTrrack<State = any, Event extends string = string>({
    registry,
    initialState,
}: ConfigureTrrackOptions<State>) {
    let isTraversing = false;
    const eventManager = initEventManager();
    const graph = initializeProvenanceGraph(initialState);

    function getNode(id: NodeId) {
        return graph.backend.nodes[id];
    }

    eventManager.listen(TrrackEvents.TRAVERSAL_START, () => {
        isTraversing = true;
    });

    eventManager.listen(TrrackEvents.TRAVERSAL_END, () => {
        isTraversing = false;
    });

    return {
        registry,
        get isTraversing() {
            return isTraversing;
        },
        getState(node: ProvenanceNode<State, any, any> = graph.current) {
            return getState(node, graph.backend.nodes);
        },
        graph,
        get current() {
            return graph.current;
        },
        get root() {
            return graph.root;
        },
        record({
            label,
            state,
            sideEffects,
            eventType,
            onlySideEffects = false,
        }: RecordActionArgs<State, Event>) {
            let newStateNode: StateNode<State, any, any> | null = null;

            let stateToSave: StateLike<State> | null = null;

            const originalState = getState(
                this.current,
                this.graph.backend.nodes
            );

            if (!onlySideEffects) {
                const patches = compare(originalState, state);

                const saveStrategy = determineSaveStrategy(state, patches);

                if (saveStrategy === 'checkpoint') {
                    stateToSave = {
                        type: 'checkpoint',
                        val: state,
                    };
                } else {
                    const lastRef =
                        this.current.state.type === 'checkpoint'
                            ? this.current.id
                            : this.current.state.checkpointRef;

                    stateToSave = {
                        type: 'patch',
                        val: patches,
                        checkpointRef: lastRef,
                    };
                }
            } else {
                stateToSave = {
                    type: 'checkpoint',
                    val: state,
                };
            }
            if (!stateToSave)
                throw new Error(
                    `Could not calculate new state. Previous state is: ${JSON.stringify(
                        this.current.state,
                        null,
                        2
                    )}`
                );

            newStateNode = createStateNode({
                label,
                state: stateToSave,
                parent: this.current,
                sideEffects,
                eventType,
            });

            if (!newStateNode) throw new Error('State Node creation failed!');

            graph.update(graph.addNode(newStateNode));
        },
        async apply<T extends string, Payload = any>(
            label: string,
            act: PayloadAction<Payload, T>
        ) {
            const action = registry.get(act.type);
            const originalState = getState(
                this.current,
                this.graph.backend.nodes
            );

            if (action.config.hasSideEffects) {
                const { do: doAct = act, undo } = (
                    action.func as TrrackActionFunction<any, any, any, any>
                )(act.payload);

                this.record({
                    label,
                    state: originalState,
                    sideEffects: { do: [doAct], undo: [undo] },
                    eventType: action.config.eventType as Event,
                });
            } else {
                const newState = (
                    action.func as ProduceWrappedStateChangeFunction<State>
                )(originalState, act.payload);

                this.record({
                    label,
                    state: newState,
                    sideEffects: { do: [], undo: [] },
                    eventType: action.config.eventType as Event,
                });
            }
        },
        async to(node: NodeId) {
            eventManager.fire(TrrackEvents.TRAVERSAL_START);

            const path = getPath(
                graph.current,
                graph.backend.nodes[node],
                graph.backend.nodes
            );

            const sideEffectsToApply: Array<PayloadAction<any, any>> = [];

            for (let i = 0; i < path.length - 1; ++i) {
                const currentNode = getNode(path[i]);
                const nextNode = getNode(path[i + 1]);

                const isUndo = isNextNodeUp(currentNode, nextNode);

                if (isUndo) {
                    if (isStateNode(currentNode))
                        sideEffectsToApply.push(
                            ...currentNode.sideEffects.undo
                        );
                } else {
                    if (isStateNode(nextNode))
                        sideEffectsToApply.push(...nextNode.sideEffects.do);
                }
            }

            for (const sf of sideEffectsToApply) {
                const actionFunction = registry.get(sf.type)
                    .func as TrrackActionFunction<any, any, any, any>;

                await actionFunction(sf.payload);
            }

            graph.update(graph.changeCurrent(node));

            eventManager.fire(TrrackEvents.TRAVERSAL_END);
        },
        undo() {
            const { current } = graph;
            if (isStateNode(current)) {
                return this.to(current.parent);
            } else {
                return Promise.resolve(console.warn('Already at root!'));
            }
        },
        redo(to?: 'latest' | 'oldest') {
            const { current } = graph;
            if (current.children.length > 0) {
                return this.to(
                    current.children[
                        to === 'oldest' ? 0 : current.children.length - 1
                    ]
                );
            } else {
                return Promise.resolve(
                    console.warn('Already at latest in this branch!')
                );
            }
        },
        currentChange(listener: any) {
            return graph.currentChange(listener);
        },
        done() {
            console.log('Setup later for URL sharing.');
        },
        tree() {
            return getTreeFromNode(graph.root, graph.backend.nodes);
        },
        on(event: TrrackEvents, listener: (args?: any) => void) {
            eventManager.listen(event, listener);
        },
        export() {
            return JSON.stringify(graph.backend);
        },
        import(graphString: string) {
            const g: ProvenanceGraph<
                State,
                Event,
                BaseArtifactType<any>
            > = JSON.parse(graphString);

            const current = g.current;
            g.current = g.root;
            graph.update(graph.load(g));
            this.to(current);
        },
    };
}

function LCA<S>(
    current: ProvenanceNode<S, any, any>,
    destination: ProvenanceNode<S, any, any>,
    nodes: Nodes<S, any, any>
): NodeId {
    let [source, target] = [current, destination];

    if (source.level > target.level) {
        [source, target] = [target, source];
    }

    let diff = target.level - source.level;

    while (isStateNode(target) && diff !== 0) {
        target = nodes[target.parent];
        diff -= 1;
    }

    if (source.id === target.id) return source.id;

    while (source.id !== target.id) {
        if (isStateNode(source)) source = nodes[source.parent];
        if (isStateNode(target)) target = nodes[target.parent];
    }

    return source.id;
}

function getPath<S>(
    current: ProvenanceNode<S, any, any>,
    destination: ProvenanceNode<S, any, any>,
    nodes: Nodes<S, any, any>
): Array<NodeId> {
    const lcaId = LCA(current, destination, nodes);
    const lca = nodes[lcaId];

    const pathFromSourceToLca: ProvenanceNode<S, any, any>[] = [];
    const pathFromDestinationToLca: ProvenanceNode<S, any, any>[] = [];

    let [source, target] = [current, destination];

    while (source.id !== lca.id) {
        pathFromSourceToLca.push(source);
        if (isStateNode(source)) source = nodes[source.parent];
    }

    pathFromSourceToLca.push(source);

    while (target.id !== lca.id) {
        pathFromDestinationToLca.push(target);
        if (isStateNode(target)) target = nodes[target.parent];
    }

    const reversedPath = pathFromDestinationToLca.reverse();

    return [...pathFromSourceToLca, ...reversedPath].map((node) => node.id);
}

function isNextNodeUp(
    source: ProvenanceNode<unknown, any, any>,
    target: ProvenanceNode<unknown, any, any>
): boolean {
    if (isStateNode(source) && source.parent === target.id) return true;
    if (isStateNode(target) && target.parent === source.id) return false;

    throw new Error(
        'Incorrect use of function. Nodes are not connected to each other.'
    );
}

type TreeNode = Omit<ProvenanceNode<any, any, any>, 'children' | 'name'> & {
    name: string;
    children: TreeNode[];
};

function getTreeFromNode(
    node: ProvenanceNode<any, any, any>,
    nodes: Nodes<any, any, any>
): TreeNode {
    return {
        ...node,
        children: node.children.map((n) => getTreeFromNode(nodes[n], nodes)),
        name: `${node.label}`,
    };
}
