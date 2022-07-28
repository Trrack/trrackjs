import {
    createStateNode,
    initializeProvenanceGraph,
    isStateNode,
    NodeId,
    Nodes,
    ProvenanceNode,
    SideEffects,
} from '../graph';
import { Registry, TrrackAction } from '../registry';

type ConfigureTrrackOptions<State> = {
    registry: Registry<any>;
    initialState: State;
};

type RecordActionArgs<State, Event extends string> = {
    label: string;
    state: State;
    eventType: Event;
    sideEffects: SideEffects;
};

function getState<State, Event extends string>(
    node: ProvenanceNode<State, Event, any>
): State {
    console.warn('Implement');
    return node.state.val as State;
}

export function initializeTrrack<State = any, Event extends string = string>({
    registry,
    initialState,
}: ConfigureTrrackOptions<State>) {
    const graph = initializeProvenanceGraph(initialState);

    function getNode(id: NodeId) {
        return graph.backend.nodes[id];
    }

    return {
        registry,
        get state() {
            return getState(graph.current);
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
            const newStateNode = createStateNode({
                label,
                state,
                parent: this.current,
                sideEffects,
                eventType,
            });
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
                    state: this.current.state.val as any,
                    sideEffects: { do: [act], undo: [undoParams] },
                    eventType: action.config.eventType as Event,
                });
            } else {
                const newState = action.func(
                    this.current.state.val as any,
                    act.payload
                );

                this.record({
                    label,
                    state: newState,
                    sideEffects: { do: [], undo: [] },
                    eventType: action.config.eventType as Event,
                });
            }
        },
        async to(node: NodeId) {
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
        },
        undo() {
            const { current } = graph;
            if (isStateNode(current)) {
                this.to(current.parent);
            } else {
                console.warn('Already at root!');
            }
        },
        redo(to?: 'latest' | 'oldest') {
            const { current } = graph;
            if (current.children.length > 0) {
                this.to(
                    current.children[
                        to === 'oldest' ? 0 : current.children.length - 1
                    ]
                );
            } else {
                console.warn('Already at latest in this branch!');
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
