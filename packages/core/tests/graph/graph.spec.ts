import { ProvenanceGraph } from '../../src';
import { RootNode } from '../../src/graph/nodes/rootnode';

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
});
