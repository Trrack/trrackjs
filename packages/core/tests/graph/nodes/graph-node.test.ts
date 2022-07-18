import { AGraphNode, GraphEdge, IGraphNode } from '../../../src';

function createIGraphNodeInstance(): IGraphNode {
    class MockGraphNode extends AGraphNode {
        constructor(first = true) {
            super();
            // Add mock node to incoming and outing
            if (first) {
                const previousNode = new MockGraphNode(false);
                const nextNode = new MockGraphNode(false);

                GraphEdge.create(previousNode, this, 'previous');
                GraphEdge.create(this, nextNode, 'next');
            }
        }
    }
    return new MockGraphNode();
}

describe('Testing Graph Node API', () => {
    it('should have an id', () => {
        const node = createIGraphNodeInstance();

        expect(typeof node.id).toBeDefined();
    });

    it('should have createdOn date property', () => {
        const node = createIGraphNodeInstance();

        expect(node.createdOn).toBeInstanceOf(Date);
    });

    it('should have an array of incoming edges', () => {
        const node = createIGraphNodeInstance();

        expect(node.incoming).toBeInstanceOf(Array);
        expect(node.incoming).toHaveLength(1);
    });

    it('should have an array of outgoing edges', () => {
        const node = createIGraphNodeInstance();

        expect(node.outgoing).toBeInstanceOf(Array);
        expect(node.outgoing).toHaveLength(1);
    });

    it('should have edges which returns all edges', () => {
        const node = createIGraphNodeInstance();

        expect(node.edges).toBeInstanceOf(Array);
        expect(node.edges).toHaveLength(
            node.incoming.length + node.outgoing.length
        );
    });
});
