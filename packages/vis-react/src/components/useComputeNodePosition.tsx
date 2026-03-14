import { NodeId, Nodes, ProvenanceNode, isStateNode } from '@trrack/core';
import { HierarchyNode, stratify } from 'd3';
import { useMemo } from 'react';
import { treeLayout } from '../utils/TreeLayout';

export type StratifiedList<T, S extends string> = HierarchyNode<
    ProvenanceNode<T, S>
>[];

export type StratifiedMap<T, S extends string> = {
    [key: string]: HierarchyNode<ProvenanceNode<T, S>> & { width?: number };
};

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

        const stratifiedList: StratifiedList<T, S> =
            stratifiedTree.descendants();
        const innerMap: StratifiedMap<T, S> = {};

        stratifiedList.forEach((c) => {
            innerMap[c.id!] = c;
        });

        treeLayout(innerMap, current, root);
        return { stratifiedMap: innerMap, links: stratifiedTree.links() };
    }, [current, root, nodeMap]);

    return { stratifiedMap, links };
}
