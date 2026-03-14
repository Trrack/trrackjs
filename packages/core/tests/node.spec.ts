import {
    createRootNode,
    createStateNode,
    isRootNode,
    isStateNode,
} from '../src/graph/components';

describe('Provenance nodes', () => {
    it('creates a root node with initial metadata and artifact', () => {
        const state = { count: 0 };
        const artifact = { file: 'root.json' };

        const node = createRootNode({
            state,
            label: 'Origin',
            initialArtifact: artifact,
            initialMetadata: {
                note: 'seed',
            },
        });

        expect(isRootNode(node)).toBe(true);
        expect(isStateNode(node)).toBe(false);
        expect(node).toMatchObject({
            id: expect.any(String),
            label: 'Origin',
            event: 'Root',
            level: 0,
            children: [],
            state: {
                type: 'checkpoint',
                val: state,
            },
        });
        expect(node.createdOn).toBeTypeOf('number');
        expect(node.meta.annotation).toEqual([]);
        expect(node.meta.bookmark).toEqual([]);
        expect(node.meta['note']).toHaveLength(1);
        expect(node.meta['note'][0]).toMatchObject({
            type: 'note',
            val: 'seed',
            id: expect.any(String),
            createdOn: expect.any(Number),
        });
        expect(node.artifacts).toHaveLength(1);
        expect(node.artifacts[0]).toMatchObject({
            id: expect.any(String),
            createdOn: expect.any(Number),
            val: artifact,
        });
    });

    it('creates a state node linked to its parent with side effects', () => {
        const root = createRootNode({
            state: { count: 0 },
        });
        const sideEffects = {
            do: [{ type: 'do/work', payload: 1 }],
            undo: [{ type: 'undo/work', payload: 1 }],
        };

        const node = createStateNode({
            parent: root,
            label: 'Increment',
            event: 'count',
            state: {
                type: 'checkpoint',
                val: { count: 1 },
            },
            sideEffects,
            initialArtifact: {
                file: 'child.json',
            },
            initialMetadata: {
                source: 'user',
            },
        });

        expect(isStateNode(node)).toBe(true);
        expect(isRootNode(node)).toBe(false);
        expect(node).toMatchObject({
            id: expect.any(String),
            label: 'Increment',
            event: 'count',
            parent: root.id,
            level: 1,
            children: [],
            sideEffects,
            state: {
                type: 'checkpoint',
                val: { count: 1 },
            },
        });
        expect(node.meta.annotation).toEqual([]);
        expect(node.meta.bookmark).toEqual([]);
        expect(node.meta['source'][0]).toMatchObject({
            type: 'source',
            val: 'user',
        });
        expect(node.artifacts[0]?.val).toEqual({
            file: 'child.json',
        });
    });
});
