import { ActionNode, ActionRegistry, ProvenanceGraph, RootNode, Trrack } from '../../src';

describe('Provenance Graph', () => {
    describe('Graph creation', () => {
        it('should create a provenance graph instance', () => {
            const graph = new ProvenanceGraph();

            expect(graph).toBeInstanceOf(ProvenanceGraph);
        });

        it('should have only one node', () => {
            const graph = new ProvenanceGraph();
            const nodes = Array.from(graph.nodes.values());
            expect(nodes).toHaveLength(1);
        });

        it('the only node should be root', () => {
            const graph = new ProvenanceGraph();
            const nodes = Array.from(graph.nodes.values());
            expect(nodes).toHaveLength(1);
            const node = nodes[0];

            expect(node.id).toEqual(graph.root.id);
            expect(node).toBeInstanceOf(RootNode);
        });

        it('root node should also be the current node', () => {
            const graph = new ProvenanceGraph();

            expect(graph.current).toBe(graph.root);
        });
    });

    describe('Graph Traversal', () => {
        it('should be able to add node to graph', () => {
            const graph = new ProvenanceGraph();
            const newNode = ActionNode.create({
                parent: graph.current,
                action: {
                    label: 'Test',
                    do: {
                        name: 'Test',
                        args: [1],
                    },
                    undo: {
                        name: 'Test',
                        args: [1],
                    },
                },
            });

            graph.addNode(newNode);

            expect(Array.from(graph.nodes.values())).toContain(newNode);
        });

        it('newly added node should be current node', () => {
            const graph = new ProvenanceGraph();
            const newNode = ActionNode.create({
                parent: graph.current,
                action: {
                    label: 'Test',
                    do: {
                        name: 'Test',
                        args: [1],
                    },
                    undo: {
                        name: 'Test',
                        args: [1],
                    },
                },
            });

            graph.addNode(newNode);

            expect(graph.current).toBe(newNode);
        });

        it('should be able to add ActionNode', () => {
            const graph = new ProvenanceGraph();
            const newNode = ActionNode.create({
                parent: graph.current,
                action: {
                    label: 'Test',
                    do: {
                        name: 'Test',
                        args: [1],
                    },
                    undo: {
                        name: 'Test',
                        args: [1],
                    },
                },
            });

            graph.addNode(newNode);

            expect(graph.current).toBeInstanceOf(ActionNode);
        });

        it('should not be able to add RootNode', () => {
            const graph = new ProvenanceGraph();
            const newNode = RootNode.create();

            expect(() => graph.addNode(newNode)).toThrow();
        });

        it('Test', () => {
            let count = 0;
            const registry = ActionRegistry.init()
                .register('add', (toAdd: number) => {
                    count += toAdd;

                    return {
                        inverse: {
                            f_id: 'sub',
                            parameters: [toAdd],
                        },
                    };
                })
                .register('sub', (toRemove: number) => {
                    count -= toRemove;

                    return {
                        inverse: {
                            f_id: 'add',
                            parameters: [toRemove],
                        },
                    };
                });

            const trrack = Trrack.setup(registry);

            console.log({ count });

            trrack.apply({
                action: 'add',
                label: 'Add 2',
                args: [2],
            });

            console.log({ count });

            trrack.apply({
                action: 'add',
                label: 'Add 3',
                args: [3],
            });

            console.log({ count });

            trrack.undo();
            console.log({ count });
            trrack.undo();

            console.log({ count });
            console.log('Hello');

            expect(true).toBeTruthy();
        });
    });
});
