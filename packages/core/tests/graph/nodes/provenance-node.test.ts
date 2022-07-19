import { AProvenanceNode, GraphEdge, IProvenanceNode, NodeType } from '../../../src';

function createMockProvenanceNode(): IProvenanceNode {
    class MockProvenanceNode extends AProvenanceNode {
        type: NodeType = 'State'; // Actual value is irrelevant for testing.

        constructor(first = true) {
            super('Mock Label');
            // Add mock node to incoming and outing
            if (first) {
                const previousNode = new MockProvenanceNode(false);
                const nextNode = new MockProvenanceNode(false);

                GraphEdge.create(previousNode, this, 'previous');
                GraphEdge.create(this, nextNode, 'next');
            }
        }
    }

    return new MockProvenanceNode();
}

describe('Testing ProvenanceNode API', () => {
    it('should have type', () => {
        const node = createMockProvenanceNode();

        expect(node.type).toBeDefined();
    });
});
