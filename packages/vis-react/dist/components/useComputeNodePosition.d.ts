import { NodeId, Nodes, ProvenanceNode } from '@trrack/core';
import { HierarchyNode } from 'd3';
export type StratifiedList<T, S extends string> = HierarchyNode<ProvenanceNode<T, S>>[];
export type StratifiedMap<T, S extends string> = {
    [key: string]: HierarchyNode<ProvenanceNode<T, S>> & {
        width?: number;
    };
};
export declare function useComputeNodePosition<T, S extends string>(nodeMap: Nodes<T, S>, current: NodeId, root: NodeId): {
    stratifiedMap: StratifiedMap<T, S>;
    links: import("d3-hierarchy").HierarchyLink<ProvenanceNode<T, S>>[];
};
