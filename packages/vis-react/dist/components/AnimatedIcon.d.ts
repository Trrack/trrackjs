import { NodeId, ProvenanceNode } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';
export declare function AnimatedIcon<T, S extends string>({ width, depth, yOffset, onClick, config, node, currentNode, nodes, isHover, setHover, colorMap, xOffset, extraHeight, }: {
    width: number;
    depth: number;
    yOffset: number;
    onClick: () => void;
    config: ProvVisConfig<T, S>;
    node: ProvenanceNode<T, S>;
    nodes: StratifiedMap<T, S>;
    currentNode: NodeId;
    isHover: boolean;
    setHover: (node: NodeId | null) => void;
    colorMap: Record<S | 'Root', string>;
    xOffset: number;
    extraHeight: number;
}): JSX.Element;
