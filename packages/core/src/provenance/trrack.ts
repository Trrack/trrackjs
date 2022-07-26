import { createStateNode, initializeProvenanceGraph, isStateNode, NodeId, Nodes, ProvenanceNode } from '../graph';
import { Registry, TrrackAction } from '../registry';

type ConfigureTrrackOptions<S> = {
    registry: Registry<any>;
    initialState: S;
};

function getState<S>(node: ProvenanceNode<S>): S {
    console.warn('Implement');
    return node.state.val as S;
}

export function initializeTrrack<S = any>({
    registry,
    initialState,
}: ConfigureTrrackOptions<S>) {
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
        apply<T extends string, Payload = any>(
            label: string,
            act: TrrackAction<T, Payload>
        ) {
            if (act.meta.hasSideEffects) {
                const action = registry.get(act.type);
                const undoParams = action(act.payload);
                const newStateNode = createStateNode(
                    this.current,
                    this.current.state.val as any,
                    label,
                    { do: [act], undo: [undoParams] }
                );
                graph.update(graph.addNode(newStateNode));
            } else {
                const action = registry.getState(act.type);
                const newState = action(
                    this.current.state.val as any,
                    act.payload
                );
                const newStateNode = createStateNode(
                    this.current,
                    newState,
                    label
                );
                graph.update(graph.addNode(newStateNode));
            }
        },
        to(node: NodeId) {
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

            sideEffectsToApply.forEach((s) => {
                const action = registry.get(s.type);
                action(s.payload);
            });

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
    current: ProvenanceNode<S>,
    destination: ProvenanceNode<S>,
    nodes: Nodes<S>
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
    current: ProvenanceNode<S>,
    destination: ProvenanceNode<S>,
    nodes: Nodes<S>
): Array<NodeId> {
    const lcaId = LCA(current, destination, nodes);
    const lca = nodes[lcaId];

    const pathFromSourceToLca: ProvenanceNode<S>[] = [];
    const pathFromDestinationToLca: ProvenanceNode<S>[] = [];

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
    source: ProvenanceNode<unknown>,
    target: ProvenanceNode<unknown>
): boolean {
    if (isStateNode(source) && source.parent === target.id) return true;
    if (isStateNode(target) && target.parent === source.id) return false;

    throw new Error(
        'Incorrect use of function. Nodes are not connected to each other.'
    );
}

type TreeNode = Omit<ProvenanceNode<any>, 'children' | 'name'> & {
    name: string;
    children: TreeNode[];
};

function getTreeFromNode(
    node: ProvenanceNode<any>,
    nodes: Nodes<any>
): TreeNode {
    return {
        ...node,
        children: node.children.map((n) => getTreeFromNode(nodes[n], nodes)),
        name: `${node.label}`,
    };
}
