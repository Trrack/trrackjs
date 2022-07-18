import { ActionNode, IActionNode } from '../../../src';

function getActionNode(): IActionNode {
    return ActionNode.create(
        'MockLabel',
        {
            name: 'mock-do-function',
            args: ['Mock Do Args'],
        },
        true,
        false
    );
}
describe('ActionNode API', () => {
    it('should have type "Action"', () => {
        const node = getActionNode();

        expect(node.type).toBe('Action');
    });

    it('should NOT be an inverse action', () => {
        const node = getActionNode();

        expect(node.isInverse).toBeFalsy();
    });

    // it('should have an inverse action', () => {
    //     const node = getActionNode();

    //     const invertingNode = node.inverse;

    //     expect(invertingNode).toBeDefined();
    //     expect(invertingNode?.isInverse).toBeTruthy();
    //     expect(invertingNode?.inverts).toEqual(node);
    // });
});
