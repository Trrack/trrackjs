import { describe, expect, it } from 'vitest';

import { createRootNode, createStateNode, isRootNode, isStateNode } from './node';

describe('node factories', () => {
    it('creates a root node with falsy metadata and artifact values', () => {
        const root = createRootNode({
            state: { counter: 0 },
            label: 'Start',
            initialArtifact: false,
            initialMetadata: {
                empty: '',
                flag: false,
                zero: 0,
            },
        });

        expect(isRootNode(root)).toBe(true);
        expect(isStateNode(root)).toBe(false);
        expect(root.label).toBe('Start');
        expect(root.level).toBe(0);
        expect(root.state).toEqual({
            type: 'checkpoint',
            val: { counter: 0 },
        });
        expect(root.artifacts).toHaveLength(1);
        expect(root.artifacts[0]?.val).toBe(false);
        expect(root.meta['empty'][0]?.val).toBe('');
        expect(root.meta['flag'][0]?.val).toBe(false);
        expect(root.meta['zero'][0]?.val).toBe(0);
    });

    it('creates a state node with the parent relationship and default side effects', () => {
        const root = createRootNode({
            state: { counter: 0 },
        });

        const stateNode = createStateNode({
            parent: root,
            label: 'Increment',
            event: 'increment',
            initialArtifact: 0,
            initialMetadata: {
                note: '',
            },
            state: {
                type: 'checkpoint',
                val: { counter: 1 },
            },
        });

        expect(isStateNode(stateNode)).toBe(true);
        expect(isRootNode(stateNode)).toBe(false);
        expect(stateNode.parent).toBe(root.id);
        expect(stateNode.level).toBe(root.level + 1);
        expect(stateNode.artifacts).toHaveLength(1);
        expect(stateNode.artifacts[0]?.val).toBe(0);
        expect(stateNode.meta['note'][0]?.val).toBe('');
        expect(stateNode.sideEffects).toEqual({
            do: [],
            undo: [],
        });
    });
});
