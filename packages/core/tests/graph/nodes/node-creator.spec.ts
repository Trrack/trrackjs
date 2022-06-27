describe('Node Creation Functions', () => {
    it('should work', () => {
        expect(true).toBeTruthy();
    });

    // describe('Root Node', () => {
    //     it('should create a correct root node', () => {
    //         const rootNode = RootNode.create();

    //         expect(rootNode).toBeInstanceOf(RootNode);
    //     });
    // });

    // describe('Action Node', () => {
    //     it('should create a correct action node', () => {
    //         const rootNode = RootNode.create();
    //         const actionNode = ActionNode.create({
    //             label: 'Test node',
    //             action: {
    //                 label: 'Test Action',
    //                 name: 'Test Action',
    //                 doArgs: [],
    //                 undoArgs: [],
    //             },
    //             parent: rootNode,
    //         });

    //         expect(actionNode).toBeInstanceOf(ActionNode);
    //         expect(actionNode.parent).toEqual(rootNode);
    //         expect(rootNode.children).toHaveLength(1);
    //         expect(rootNode.children[0]).toEqual(actionNode);
    //     });
    // });
});
