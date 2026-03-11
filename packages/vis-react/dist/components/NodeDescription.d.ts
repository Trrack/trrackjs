import { NodeId, ProvenanceNode } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
export declare function NodeDescription<T, S extends string>({ depth, yOffset, node, config, onClick, isHover, setHover, colorMap, isCurrent, extraHeight, setExtraHeight, }: {
    depth: number;
    yOffset: number;
    node: ProvenanceNode<T, S>;
    config: ProvVisConfig<T, S>;
    currentNode: NodeId;
    onClick: () => void;
    isHover: boolean;
    setHover: (node: NodeId | null) => void;
    colorMap: Record<S | 'Root', string>;
    isCurrent: boolean;
    extraHeight: number;
    setExtraHeight: (n: number) => void;
}): JSX.Element;
