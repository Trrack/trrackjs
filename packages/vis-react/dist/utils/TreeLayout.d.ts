import { ProvenanceNode } from '@trrack/core';
import { HierarchyNode } from 'd3';
import { StratifiedMap } from '../components/useComputeNodePosition';
export type TreeNode = HierarchyNode<unknown>;
export interface ExtendedHierarchyNode<T, S extends string> extends HierarchyNode<ProvenanceNode<T, S>> {
    column: number;
}
export type ExtendedStratifiedMap<T, S extends string> = {
    [key: string]: ExtendedHierarchyNode<T, S>;
};
export declare function getPathTo<T, S extends string>(nodes: StratifiedMap<T, S>, from: string, to: string): string[];
export declare function treeLayout<T, S extends string>(nodes: StratifiedMap<T, S>, current: string, root: string): string[];
