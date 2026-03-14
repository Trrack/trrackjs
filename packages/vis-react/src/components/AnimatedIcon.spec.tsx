import { fireEvent, render } from '@testing-library/react';
import { NodeId, RootNode, StateNode } from '@trrack/core';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IconConfig } from '../utils/IconConfig';
import { ProvVisConfig } from './ProvVis';
import { AnimatedIcon } from './AnimatedIcon';
import { StratifiedMap } from './useComputeNodePosition';

const { lastTransitionConfig, transitionAnimating } = vi.hoisted(() => ({
    lastTransitionConfig: {
        current: undefined as undefined | Record<string, unknown>,
    },
    transitionAnimating: {
        current: false,
    },
}));

vi.mock('@react-spring/web', async () => {
    const ReactModule = await import('react');

    return {
        animated: {
            g: (props: React.SVGProps<SVGGElement>) => {
                const { children, transform, opacity, ...svgProps } = props;
                void transform;
                void opacity;

                return ReactModule.createElement('g', svgProps, children);
            },
        },
        easings: {
            easeInOutSine: (value: number) => value,
        },
        useTransition: (items: unknown[], config: Record<string, unknown>) => {
            lastTransitionConfig.current = config;

            return (renderTransition: (style: { transform: { isAnimating: boolean } }) => React.ReactNode) =>
                items.map((_, index) =>
                    ReactModule.createElement(
                        ReactModule.Fragment,
                        { key: index },
                        renderTransition({
                            transform: {
                                isAnimating: transitionAnimating.current,
                            },
                        })
                    )
                );
        },
    };
});

type EventType = 'add';

type State = {
    count: number;
};

function createConfig(
    iconConfig: IconConfig<State, EventType> | null,
    overrides: Partial<ProvVisConfig<State, EventType>> = {}
): ProvVisConfig<State, EventType> {
    return {
        animationDuration: 0,
        annotateNode: null,
        annotationHeight: 150,
        bookmarkNode: null,
        changeCurrent: vi.fn(),
        getAnnotation: () => 'Needs review',
        gutter: 25,
        iconConfig,
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
        ...overrides,
    };
}

function createNodes(withSibling = false) {
    const root = {
        artifacts: [],
        children: ['node-1' as NodeId],
        createdOn: Date.now(),
        event: 'Root',
        id: 'root' as NodeId,
        label: 'Root',
        level: 0,
        meta: {
            annotation: [],
            bookmark: [],
        },
        state: {
            type: 'checkpoint',
            val: { count: 0 },
        },
    } satisfies RootNode<State>;

    const node = {
        artifacts: [],
        children: [],
        createdOn: Date.now(),
        event: 'add',
        id: 'node-1' as NodeId,
        label: 'Add item',
        level: 1,
        meta: {
            annotation: [],
            bookmark: [],
        },
        parent: 'root' as NodeId,
        sideEffects: {
            do: [],
            undo: [],
        },
        state: {
            type: 'checkpoint',
            val: { count: 1 },
        },
    } satisfies StateNode<State, EventType>;

    return {
        root,
        node,
        nodes: {
            root: {
                children: withSibling ? ['node-1', 'node-2'] : ['node-1'],
                data: root,
                depth: 0,
                height: 1,
                id: 'root',
                width: 0,
            },
            'node-1': {
                children: [],
                data: node,
                depth: 1,
                height: 0,
                id: 'node-1',
                parent: 'root',
                width: 1,
            },
            ...(withSibling
                ? {
                      'node-2': {
                          children: [],
                          data: {
                              ...node,
                              id: 'node-2' as NodeId,
                              label: 'Sibling item',
                          },
                          depth: 1,
                          height: 0,
                          id: 'node-2',
                          parent: 'root',
                          width: 1,
                      },
                  }
                : {}),
        } as unknown as StratifiedMap<State, EventType>,
    };
}

beforeEach(() => {
    transitionAnimating.current = false;
    lastTransitionConfig.current = undefined;
});

describe('AnimatedIcon', () => {
    it('uses custom icon precedence and includes annotations in the tooltip', () => {
        const iconConfig: IconConfig<State, EventType> = {
            add: {
                backboneGlyph: () => <g data-testid="glyph-backbone" />,
                currentGlyph: () => <g data-testid="glyph-current" />,
                glyph: () => <g data-testid="glyph-default" />,
                hoverGlyph: () => <g data-testid="glyph-hover" />,
            },
        };

        const { node, nodes } = createNodes();
        const view = render(
            <svg>
                <AnimatedIcon
                    colorMap={{ Root: 'black', add: 'cornflowerblue' }}
                    config={createConfig(iconConfig)}
                    currentNode={'node-1' as NodeId}
                    depth={1}
                    extraHeight={0}
                    isHover={false}
                    node={node}
                    nodes={nodes}
                    onClick={() => undefined}
                    setHover={() => undefined}
                    width={1}
                    xOffset={0}
                    yOffset={0}
                />
            </svg>
        );

        expect(view.getByTestId('glyph-current')).toBeTruthy();
        expect(view.container.querySelector('title')?.textContent).toBe(
            'Node: Add item\nNeeds review'
        );

        view.rerender(
            <svg>
                <AnimatedIcon
                    colorMap={{ Root: 'black', add: 'cornflowerblue' }}
                    config={createConfig(iconConfig)}
                    currentNode={'root' as NodeId}
                    depth={1}
                    extraHeight={0}
                    isHover={true}
                    node={node}
                    nodes={nodes}
                    onClick={() => undefined}
                    setHover={() => undefined}
                    width={1}
                    xOffset={0}
                    yOffset={0}
                />
            </svg>
        );

        expect(view.getByTestId('glyph-hover')).toBeTruthy();

        view.rerender(
            <svg>
                <AnimatedIcon
                    colorMap={{ Root: 'black', add: 'cornflowerblue' }}
                    config={createConfig(iconConfig)}
                    currentNode={'root' as NodeId}
                    depth={1}
                    extraHeight={0}
                    isHover={false}
                    node={node}
                    nodes={nodes}
                    onClick={() => undefined}
                    setHover={() => undefined}
                    width={0}
                    xOffset={0}
                    yOffset={0}
                />
            </svg>
        );

        expect(view.getByTestId('glyph-backbone')).toBeTruthy();

        view.rerender(
            <svg>
                <AnimatedIcon
                    colorMap={{ Root: 'black', add: 'cornflowerblue' }}
                    config={createConfig(iconConfig)}
                    currentNode={'root' as NodeId}
                    depth={1}
                    extraHeight={0}
                    isHover={false}
                    node={node}
                    nodes={nodes}
                    onClick={() => undefined}
                    setHover={() => undefined}
                    width={1}
                    xOffset={0}
                    yOffset={0}
                />
            </svg>
        );

        expect(view.getByTestId('glyph-default')).toBeTruthy();
    });

    it('uses dark-mode default icons and delays enter animations for sibling branches', () => {
        const { node, nodes } = createNodes(true);
        const view = render(
            <svg>
                <AnimatedIcon
                    colorMap={{ Root: 'white', add: 'cornflowerblue' }}
                    config={createConfig(null, {
                        animationDuration: 120,
                        isDarkMode: true,
                    })}
                    currentNode={'root' as NodeId}
                    depth={1}
                    extraHeight={0}
                    isHover={false}
                    node={node}
                    nodes={nodes}
                    onClick={() => undefined}
                    setHover={() => undefined}
                    width={1}
                    xOffset={0}
                    yOffset={0}
                />
            </svg>
        );

        const circle = view.container.querySelector('circle');

        expect(circle?.getAttribute('fill')).toBe('#413839');
        expect(lastTransitionConfig.current?.['enter']).toMatchObject({
            delay: 40,
        });
    });

    it('does not set hover while animating', () => {
        transitionAnimating.current = true;
        const setHover = vi.fn();
        const { node, nodes } = createNodes();
        const view = render(
            <svg>
                <AnimatedIcon
                    colorMap={{ Root: 'black', add: 'cornflowerblue' }}
                    config={createConfig(null)}
                    currentNode={'root' as NodeId}
                    depth={1}
                    extraHeight={0}
                    isHover={false}
                    node={node}
                    nodes={nodes}
                    onClick={() => undefined}
                    setHover={setHover}
                    width={1}
                    xOffset={0}
                    yOffset={0}
                />
            </svg>
        );

        fireEvent.mouseOver(view.container.querySelector('.provenance-node')!);

        expect(setHover).not.toHaveBeenCalled();
    });
});
