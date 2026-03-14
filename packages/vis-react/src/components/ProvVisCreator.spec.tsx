import { describe, expect, it, vi } from 'vitest';

const { createRootSpy, provVisSpy } = vi.hoisted(() => ({
    createRootSpy: vi.fn(),
    provVisSpy: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
    createRoot: (...args: unknown[]) => createRootSpy(...args),
}));

vi.mock('./ProvVis', () => ({
    ProvVis: (props: unknown) => {
        provVisSpy(props);
        return null;
    },
}));

import { ProvVisCreator } from './ProvVisCreator';

type MockTrrack = {
    current: { id: string };
    currentChange: (listener: () => void) => () => boolean;
    graph: {
        backend: {
            nodes: Record<string, { id: string }>;
        };
    };
    root: { id: string };
    to: ReturnType<typeof vi.fn>;
};

describe('ProvVisCreator', () => {
    it('renders, rerenders on current changes, and stops rerendering after cleanup', async () => {
        const render = vi.fn();
        const unmount = vi.fn();
        createRootSpy.mockReturnValue({
            render,
            unmount,
        });

        let currentChangeListener: (() => void) | undefined;
        const unsubscribe = vi.fn(() => true);

        const trrack: MockTrrack = {
            current: { id: 'root' },
            currentChange(listener: () => void) {
                currentChangeListener = listener;
                return unsubscribe;
            },
            graph: {
                backend: {
                    nodes: {
                        root: { id: 'root' },
                    },
                },
            },
            root: { id: 'root' },
            to: vi.fn(),
        };

        const element = document.createElement('div');
        const cleanup = await ProvVisCreator(element, trrack, {
            marginTop: 75,
        });

        expect(createRootSpy).toHaveBeenCalledWith(element);
        expect(render).toHaveBeenCalledTimes(1);
        const firstRender = render.mock.calls[0]?.[0] as {
            props: {
                config: {
                    marginTop: number;
                };
                currentNode: string;
                nodeMap: Record<string, unknown>;
                root: string;
            };
        };
        expect(firstRender.props).toEqual(
            expect.objectContaining({
                config: expect.objectContaining({
                    marginTop: 75,
                }),
                currentNode: 'root',
                root: 'root',
            })
        );
        expect(firstRender.props.nodeMap).toEqual({
            root: { id: 'root' },
        });

        trrack.current = { id: 'node-1' };
        trrack.graph.backend.nodes['node-1'] = { id: 'node-1' };
        currentChangeListener?.();

        expect(render).toHaveBeenCalledTimes(2);
        expect(cleanup()).toBe(true);
        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(unmount).toHaveBeenCalledTimes(1);
        expect(cleanup()).toBe(false);

        trrack.current = { id: 'node-2' };
        trrack.graph.backend.nodes['node-2'] = { id: 'node-2' };
        currentChangeListener?.();

        expect(render).toHaveBeenCalledTimes(2);
    });
});
