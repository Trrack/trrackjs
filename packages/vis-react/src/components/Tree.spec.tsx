import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { selectOnSpy, transformSpy, zoomHandlers } = vi.hoisted(() => ({
    selectOnSpy: vi.fn(),
    transformSpy: vi.fn(),
    zoomHandlers: [] as Array<(event: { transform: { x: number } }) => void>,
}));

vi.mock('@react-spring/web', async () => {
    const React = await import('react');

    return {
        animated: {
            div: (props: React.HTMLAttributes<HTMLDivElement> & { config?: unknown }) => {
                const { children, config, ...divProps } = props;
                void config;

                return React.createElement('div', divProps, children);
            },
            g: (props: React.SVGProps<SVGGElement> & {
                config?: unknown;
                immediate?: unknown;
            }) => {
                const { children, config, immediate, ...svgProps } = props;
                void config;
                void immediate;

                return React.createElement('g', svgProps, children);
            },
        },
        easings: {
            easeInOutSine: (value: number) => value,
        },
        useSpring: (props: Record<string, unknown>) => props,
    };
});

vi.mock('./AnimatedIcon', () => ({
    AnimatedIcon: () => null,
}));

vi.mock('./AnimatedLine', () => ({
    AnimatedLine: () => null,
}));

vi.mock('./NodeDescription', () => ({
    NodeDescription: () => null,
}));

vi.mock('d3-selection', () => ({
    select: () => ({
        call: vi.fn(),
        on: selectOnSpy,
    }),
}));

vi.mock('d3-zoom', () => ({
    zoomIdentity: { x: 0 },
    zoom: () => {
        const behavior = {
            scaleExtent: vi.fn(),
            translateExtent: vi.fn(),
            on: vi.fn(),
            transform: vi.fn(),
        };

        behavior.scaleExtent.mockReturnValue(behavior);
        behavior.translateExtent.mockReturnValue(behavior);
        behavior.on.mockImplementation(
            (
                event: string,
                handler: (event: { transform: { x: number } }) => void
            ) => {
                if (event === 'zoom') {
                    zoomHandlers.push(handler);
                }
                return behavior;
            }
        );
        behavior.transform.mockImplementation(
            (_selection: unknown, transform: { x?: number }) => {
                transformSpy(transform);
                zoomHandlers.at(-1)?.({
                    transform: {
                        x: transform.x ?? 0,
                    },
                });
                return behavior;
            }
        );
        return behavior;
    },
}));

import type { NodeId } from '@trrack/core';
import { Tree } from './Tree';
import type { ProvVisConfig } from './ProvVis';
import type { StratifiedMap } from './useComputeNodePosition';

type EventType = 'add';

type State = {
    count: number;
};

function createConfig(): ProvVisConfig<State, EventType> {
    return {
        animationDuration: 0,
        annotateNode: null,
        annotationHeight: 150,
        bookmarkNode: null,
        changeCurrent: vi.fn(),
        getAnnotation: () => '',
        gutter: 25,
        iconConfig: null,
        isBookmarked: () => false,
        isDarkMode: false,
        labelWidth: 150,
        marginLeft: 50,
        marginRight: 40,
        marginTop: 50,
        nodeAndLabelGap: 20,
        nodeExtra: {},
        nodeWidthShown: 3,
        verticalSpace: 30,
    };
}

function createNodes(childWidth = 1): StratifiedMap<State, EventType> {
    return {
        root: {
            children: ['child'],
            data: {
                event: 'Root',
                id: 'root' as NodeId,
                label: 'Root',
            } as unknown as StratifiedMap<State, EventType>[string]['data'],
            depth: 0,
            height: 5,
            id: 'root',
            width: 0,
        },
        child: {
            children: [],
            data: {
                event: 'add',
                id: 'child' as NodeId,
                label: 'Child',
            } as unknown as StratifiedMap<State, EventType>[string]['data'],
            depth: 5,
            height: 0,
            id: 'child',
            parent: 'root',
            width: childWidth,
        },
    };
}

beforeEach(() => {
    zoomHandlers.length = 0;
    transformSpy.mockClear();
    selectOnSpy.mockClear();
    vi.restoreAllMocks();

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
        configurable: true,
        value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
        configurable: true,
        value: 0,
        writable: true,
    });
    Object.defineProperty(SVGSVGElement.prototype, 'width', {
        configurable: true,
        value: {
            baseVal: {
                value: 145,
            },
        },
    });
    Object.defineProperty(SVGSVGElement.prototype, 'height', {
        configurable: true,
        value: {
            baseVal: {
                value: 230,
            },
        },
    });
    Element.prototype.scrollTo = vi.fn();
});

describe('Tree', () => {
    it('scrolls when the current node is below the viewport, resets pan on node changes, and does not scroll when already visible', async () => {
        const nodes = createNodes();
        const config = createConfig();
        const view = render(
            <Tree
                config={config}
                currentNode={'child' as NodeId}
                links={[]}
                nodes={nodes}
            />
        );

        await waitFor(() => {
            expect(Element.prototype.scrollTo).toHaveBeenCalledWith(0, 130);
        });

        zoomHandlers[0]?.({
            transform: {
                x: 30,
            },
        });

        await waitFor(() => {
            expect(view.container.querySelector('g')?.getAttribute('transform')).toBe(
                'translate(80, 50)'
            );
        });

        (Element.prototype.scrollTo as unknown as ReturnType<typeof vi.fn>).mockClear();

        view.rerender(
            <Tree
                config={config}
                currentNode={'root' as NodeId}
                links={[]}
                nodes={nodes}
            />
        );

        await waitFor(() => {
            expect(transformSpy).toHaveBeenCalled();
        });
        expect(view.container.querySelector('g')?.getAttribute('transform')).toBe(
            'translate(50, 50)'
        );
        expect(Element.prototype.scrollTo).not.toHaveBeenCalled();
    });

    it('falls back to scrollTop updates when scrollTo is unavailable and exposes pan cursor for wider trees', async () => {
        Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
            configurable: true,
            value: undefined,
        });

        const nodes = createNodes(5);
        const config = createConfig();
        const view = render(
            <Tree
                config={config}
                currentNode={'child' as NodeId}
                links={[]}
                nodes={nodes}
            />
        );

        await waitFor(() => {
            expect(
                (view.container.firstElementChild as HTMLDivElement).scrollTop
            ).toBe(130);
        });
        expect(view.container.querySelector('svg')?.getAttribute('cursor')).toBe(
            'ew-resize'
        );
    });
});
