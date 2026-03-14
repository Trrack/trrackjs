import { NodeId, Nodes, ProvenanceNode, isStateNode } from '@trrack/core';
import { stratify } from 'd3-hierarchy';
import { useMemo } from 'react';
import { treeLayout } from '../utils/TreeLayout';

export interface LayoutNode<T, S extends string> {
    id: string;
    data: ProvenanceNode<T, S>;
    depth: number;
    height: number;
    parent?: string;
    children: string[];
    width?: number;
}

export type StratifiedList<T, S extends string> = LayoutNode<T, S>[];

export type StratifiedMap<T, S extends string> = {
    [key: string]: LayoutNode<T, S>;
};

export interface StratifiedLink<T, S extends string> {
    source: LayoutNode<T, S>;
    target: LayoutNode<T, S>;
}

export function useComputeNodePosition<T, S extends string>(
    nodeMap: Nodes<T, S>,
    current: NodeId,
    root: NodeId
) {
    const { stratifiedMap, links } = useMemo(() => {
        const nodeList = Object.values(nodeMap);

        const strat = stratify<ProvenanceNode<T, S>>()
            .id((d) => d.id)
            .parentId((d) => {
                if (d.id === root) return null;

                if (isStateNode(d)) {
                    return d.parent;
                }
                return null;
            });

        const stratifiedTree = strat(nodeList);

        const stratifiedList: StratifiedList<T, S> = stratifiedTree
            .descendants()
            .map((node) => ({
                id: node.id!,
                data: node.data,
                depth: node.depth,
                height: node.height,
                parent: node.parent?.id,
                children: node.children?.map((child) => child.id!) || [],
            }));
        const innerMap: StratifiedMap<T, S> = {};

        stratifiedList.forEach((c) => {
            innerMap[c.id] = c;
        });

        treeLayout(innerMap, current, root);

        const links: StratifiedLink<T, S>[] = stratifiedTree.links().map(
            (link) => ({
                source: innerMap[link.source.id!],
                target: innerMap[link.target.id!],
            })
        );

        return { stratifiedMap: innerMap, links };
    }, [current, root, nodeMap]);

    return { stratifiedMap, links };
}
