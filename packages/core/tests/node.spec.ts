describe('Placeholder test', () => {
    it('should pass', () => {
        expect(true).toBeTruthy();
    });
});

// describe('Provenance Node', () => {
//     it('should create root node', () => {
//         type State = {
//             test: number;
//         };

//         const dummyState: State = {
//             test: 0,
//         };

//         const node = createRootNode({
//             state: dummyState,
//             artifact: {
//                 createdOn: Date.now(),
//                 id: 'Test Artifact',
//                 val: {},
//             },
//         });

//         expect(node).toBeDefined();
//         expect(node).toMatchObject({
//             id: expect.any(String),
//             label: 'Root',
//             level: 0,
//             meta: expect.objectContaining({
//                 createdOn: expect.any(Number),
//                 eventType: 'Root',
//             }),
//             state: expect.objectContaining({
//                 type: 'checkpoint',
//                 val: dummyState,
//             }),
//             artifact: expect.objectContaining({
//                 createdOn: expect.any(Number),
//                 id: expect.any(String),
//                 val: expect.any(Object),
//             }),
//         });
//     });

//     it('should create state node', () => {
//         type State = {
//             test: number;
//         };

//         const dummyState: State = {
//             test: 0,
//         };

//         const root = createRootNode({
//             state: dummyState,
//             artifact: {
//                 createdOn: Date.now(),
//                 id: 'Test Artifact',
//                 val: {},
//             },
//         });

//         const state = createStateNode({
//             parent: root,
//             state: { type: 'checkpoint', val: { ...dummyState, test: 1 } },
//             label: 'Test Label',
//             eventType: 'Test',
//         });

//         expect(state).toBeDefined();
//         expect(state).toMatchObject({
//             id: expect.any(String),
//             label: 'Root',
//             level: 0,
//             meta: expect.objectContaining({
//                 createdOn: expect.any(Number),
//                 eventType: 'Root',
//             }),
//             state: expect.objectContaining({
//                 type: 'checkpoint',
//                 val: dummyState,
//             }),
//             artifact: undefined,
//         });
//     });
// });
