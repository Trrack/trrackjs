import { ProvenanceNode } from '@trrack/core';
import { HierarchyNode } from 'd3';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';
export declare function AnimatedLine<T, S extends string>({ x1Width, x2Width, y1Depth, y2Depth, y1Offset, y2Offset, config, xOffset, uniqueKey, nodes, parentNode, }: {
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
}): JSX.Element;
