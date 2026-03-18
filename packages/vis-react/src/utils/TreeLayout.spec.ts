import { describe, expect, it } from 'vitest';

import { StratifiedMap } from '../components/useComputeNodePosition';
import { getPathTo, treeLayout } from './TreeLayout';

function createNode(id: string, children: string[] = [], parent?: string) {
    return {
        id,
        children,
        data: {
            id,
        } as never,
        depth: parent ? 1 : 0,
        height: children.length === 0 ? 0 : 1,
        parent,
    };
}

describe('treeLayout', () => {
    it('returns the path to the current node and keeps that path on the backbone', () => {
        const nodes = {
            root: createNode('root', ['branch-a', 'branch-b']),
            'branch-a': createNode('branch-a', ['leaf-a'], 'root'),
            'leaf-a': createNode('leaf-a', [], 'branch-a'),
            'branch-b': createNode('branch-b', [], 'root'),
        } as unknown as StratifiedMap<unknown, string>;

        expect(getPathTo(nodes, 'root', 'leaf-a')).toEqual([
            'root',
            'branch-a',
            'leaf-a',
        ]);

        const currentPath = treeLayout(nodes, 'leaf-a', 'root');

        expect(currentPath).toEqual(['root', 'branch-a', 'leaf-a']);
        expect(nodes['root'].width).toBe(0);
        expect(nodes['branch-a'].width).toBe(0);
        expect(nodes['leaf-a'].width).toBe(0);
        expect(nodes['branch-b'].width).toBe(1);
    });

    it('returns only the start node when the destination is missing', () => {
        const nodes = {
            root: createNode('root', ['child']),
            child: createNode('child', [], 'root'),
        } as unknown as StratifiedMap<unknown, string>;

        expect(getPathTo(nodes, 'root', 'missing')).toEqual(['root']);
    });
});
