import { IStateNode, StateNode } from '../../../src';

function getStateNode(): IStateNode {
    return StateNode.create('Mock Label');
}

describe('StateNode API', () => {
    it('should have type "State"', () => {
        const node = getStateNode();

        expect(node.type).toBe('State');
    });
});
