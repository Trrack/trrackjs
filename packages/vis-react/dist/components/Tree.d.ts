import { NodeId, ProvenanceNode } from '@trrack/core';
import * as d3 from 'd3';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';
export declare function Tree<T, S extends string>({ nodes, links, currentNode, config, }: {
    nodes: StratifiedMap<T, S>;
    links: d3.HierarchyLink<ProvenanceNode<T, S>>[];
    config: ProvVisConfig<T, S>;
    currentNode: NodeId;
}): JSX.Element;
