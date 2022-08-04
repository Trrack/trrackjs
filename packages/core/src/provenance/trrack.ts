/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyPatches, Patch } from 'immer';

import { initEventManager } from '../event';
import {
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
import { Registry, TrrackAction } from '../registry';

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
    state:
        | {
              type: 'stateLike';
              val: StateLike<State>;
          }
        | {
              type: 'stateWithPatches';
              val: [State, Patch[], Patch[]];
          };
    eventType: Event;
    sideEffects: SideEffects;
};

function getState<State, Event extends string>(
    node: ProvenanceNode<State, Event, any>,
    nodes: Nodes<State, Event, any>
): State {
    const stateLike = node.state;

    if (stateLike.type === 'checkpoint') return stateLike.val;

    const { checkpointRef, val } = stateLike;
    const checkpointNode = nodes[checkpointRef];
    const checkpointState = getState(checkpointNode, nodes);

    return applyPatches(checkpointState, val);
}

function determineSaveStrategy<T>(
    state: T,
    patches: Array<Patch>
): 'checkpoint' | 'patch' {
    const objectKeysLength = Object.keys(state).length;

    const uniquePatchesLength = new Set(
        patches.map((patch) => {
            return patch.path[0];
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
        }: RecordActionArgs<State, Event>) {
            let newStateNode: StateNode<State, any, any> | null = null;

            if (state.type === 'stateLike') {
                newStateNode = createStateNode({
                    label,
                    state: state.val,
                    parent: this.current,
                    sideEffects,
                    eventType,
                });
            } else if (state.type === 'stateWithPatches') {
                const newState = state.val[0];
                const patches = state.val[1];

                const saveStrategy = determineSaveStrategy(newState, patches);

                let stateLike: StateLike<State>;

                if (saveStrategy === 'checkpoint') {
                    stateLike = {
                        type: 'checkpoint',
                        val: newState,
                    };
                } else {
                    const lastRef =
                        this.current.state.type === 'checkpoint'
                            ? this.current.id
                            : this.current.state.checkpointRef;

                    stateLike = {
                        type: 'patch',
                        val: patches,
                        checkpointRef: lastRef,
                    };
                }

                newStateNode = createStateNode({
                    label,
                    state: stateLike,
                    parent: this.current,
                    sideEffects,
                    eventType,
                });
            }

            if (!newStateNode) throw new Error('State Node creation failed!');

            graph.update(graph.addNode(newStateNode));
        },
        apply<T extends string, Payload = any>(
            label: string,
            act: TrrackAction<T, Payload>
        ) {
            const action = registry.get(act.type);
            if (action.config.hasSideEffects) {
                const undoParams = (action as any).func(act.payload);

                this.record({
                    label,
                    state: {
                        type: 'stateLike',
                        val: this.current.state,
                    },
                    sideEffects: { do: [act], undo: [undoParams] },
                    eventType: action.config.eventType as Event,
                });
            } else {
                const stateWithPatches = action.func(
                    this.current.state.val as any,
                    act.payload
                );

                this.record({
                    label,
                    state: {
                        type: 'stateWithPatches',
                        val: stateWithPatches,
                    },
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

            const sideEffectsToApply: Array<TrrackAction<any, any>> = [];

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
                const action = registry.get(sf.type);

                await action.func(sf.payload);
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
