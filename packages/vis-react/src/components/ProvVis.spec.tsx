import type { Nodes } from '@trrack/core';
import { describe, expect, it, vi } from 'vitest';

const { computeSpy, latestTreeProps } = vi.hoisted(() => ({
    computeSpy: vi.fn(() => ({
        links: ['link'],
        stratifiedMap: { root: { id: 'root' } },
    })),
    latestTreeProps: {
        current: undefined as unknown,
    },
}));

vi.mock('./Tree', () => ({
    Tree: (props: unknown) => {
        latestTreeProps.current = props;
        return null;
    },
}));

vi.mock('./useComputeNodePosition', () => ({
    useComputeNodePosition: (
        nodeMap: unknown,
        current: unknown,
        root: unknown
    ) => computeSpy(nodeMap, current, root),
}));

import { ProvVis } from './ProvVis';
import { render } from '@testing-library/react';

describe('ProvVis', () => {
    it('merges partial config with defaults before rendering Tree', () => {
        render(
            <ProvVis
                currentNode={'root' as never}
                root={'root' as never}
                nodeMap={{} as Nodes<unknown, string>}
                config={{
                    changeCurrent: vi.fn(),
                    marginTop: 75,
                }}
            />
        );

        expect(computeSpy).toHaveBeenCalledWith({}, 'root', 'root');
        const props = latestTreeProps.current as {
            config: {
                gutter: number;
                marginTop: number;
                changeCurrent: () => void;
                nodeExtra: Record<string, unknown>;
            };
            currentNode: string;
            links: unknown[];
            nodes: Record<string, unknown>;
        };

        expect(props.currentNode).toBe('root');
        expect(props.nodes).toEqual({ root: { id: 'root' } });
        expect(props.links).toEqual(['link']);
        expect(props.config.gutter).toBe(25);
        expect(props.config.marginTop).toBe(75);
        expect(typeof props.config.changeCurrent).toBe('function');
        expect(props.config.nodeExtra).toEqual({});
    });
});
