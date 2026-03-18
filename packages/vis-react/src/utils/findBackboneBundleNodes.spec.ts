import { describe, expect, it } from 'vitest';

import findBackboneBundleNodes from './findBackboneBundleNodes';

describe('findBackboneBundleNodes', () => {
    it('returns the bundle and bundled nodes when all are on the backbone', () => {
        expect(
            findBackboneBundleNodes(
                {
                    bundleA: { width: 0 },
                    'node-1': { width: 0 },
                    'node-2': { width: 0 },
                },
                {
                    bundleA: {
                        metadata: null,
                        bundleLabel: 'Bundle A',
                        bunchedNodes: ['node-1', 'node-2'],
                    },
                }
            )
        ).toEqual(['bundleA', 'node-1', 'node-2']);
    });

    it('returns no backbone bundle nodes when any bundled node is off the backbone', () => {
        expect(
            findBackboneBundleNodes(
                {
                    bundleA: { width: 0 },
                    'node-1': { width: 1 },
                    'node-2': { width: 0 },
                },
                {
                    bundleA: {
                        metadata: null,
                        bundleLabel: 'Bundle A',
                        bunchedNodes: ['node-1', 'node-2'],
                    },
                }
            )
        ).toEqual([]);
    });
});
