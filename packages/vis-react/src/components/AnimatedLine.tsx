import { ProvenanceNode } from '@trrack/core';
import { HierarchyNode } from 'd3';
import { animated, easings, useTransition } from 'react-spring';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';

export function AnimatedLine<T, S extends string>({
    x1Width,
    x2Width,
    y1Depth,
    y2Depth,
    y1Offset,
    y2Offset,
    config,
    xOffset,
    uniqueKey,
    nodes,
    parentNode,
}: {
    x1Width: number;
    x2Width: number;
    y1Depth: number;
    y2Depth: number;
    y1Offset: number;
    y2Offset: number;
    config: ProvVisConfig<T, S>;
    xOffset: number;
    uniqueKey: string;
    nodes: StratifiedMap<T, S>;
    parentNode: HierarchyNode<ProvenanceNode<T, S>>;
}) {
    const transitions = useTransition([uniqueKey], {
        config: {
            duration: config.animationDuration,

            easing: easings.easeInOutSine,
        },
        keys: [uniqueKey],
        from: {
            opacity: 0,
            y1: (y1Depth - 1) * config.verticalSpace + y1Offset,
            y2: (y2Depth - 1) * config.verticalSpace + y2Offset,
        },
        enter: {
            delay:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                nodes[parentNode.id].children.length > 1
                    ? config.animationDuration / 3
                    : 0,
            opacity: 1,
            x1: -x1Width * config.gutter + xOffset,
            x2: -x2Width * config.gutter + xOffset,
            y1: y1Depth * config.verticalSpace + y1Offset,
            y2: y2Depth * config.verticalSpace + y2Offset,
        },
        update: {
            opacity: 1,
            x1: -x1Width * config.gutter + xOffset,
            x2: -x2Width * config.gutter + xOffset,
            y1: y1Depth * config.verticalSpace + y1Offset,
            y2: y2Depth * config.verticalSpace + y2Offset,
        },
    });

    return transitions((style) => {
        return (
            <animated.line
                {...style}
                stroke={config.isDarkMode ? 'white' : 'black'}
                pointerEvents="none"
            />
        );
    });
}
