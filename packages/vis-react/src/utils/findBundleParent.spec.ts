import { describe, expect, it } from 'vitest';

import findBundleParent from './findBundleParent';

describe('findBundleParent', () => {
    it('returns all bundles that contain a node', () => {
        expect(
            findBundleParent('node-1', {
                bundleA: {
                    metadata: null,
                    bundleLabel: 'Bundle A',
                    bunchedNodes: ['node-1', 'node-2'],
                },
                bundleB: {
                    metadata: null,
                    bundleLabel: 'Bundle B',
                    bunchedNodes: ['node-1'],
                },
            })
        ).toEqual(['bundleA', 'bundleB']);
    });

    it('returns an empty array when no bundle contains the node', () => {
        expect(
            findBundleParent('missing', {
                bundleA: {
                    metadata: null,
                    bundleLabel: 'Bundle A',
                    bunchedNodes: ['node-1'],
                },
            })
        ).toEqual([]);
    });
});
