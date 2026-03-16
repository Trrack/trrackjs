import { StratifiedMap } from '../components/useComputeNodePosition';

function DFS<T, S extends string>(
    nodes: StratifiedMap<T, S>,
    node: string,
    depthMap: Record<string, number>,
    currentPath: string[]
) {
    const explored = new Set<string>();
    const toExplore = [nodes[node]];

    let currDepth = 0;

    while (toExplore.length > 0) {
        const temp = toExplore.pop();

        if (!temp) {
            continue;
        }

        if (!explored.has(temp.id)) {
            temp.width = currDepth;
            depthMap[temp.id] = temp.width;
            explored.add(temp.id);
        } else {
            temp.width = depthMap[temp.id];
        }

        if (temp.children.length > 0) {
            toExplore.push(
                ...temp.children.sort((a: string, b: string) => {
                    const aIncludes = currentPath.includes(a) ? 1 : 0;
                    const bIncludes = currentPath.includes(b) ? 1 : 0;
                    return aIncludes - bIncludes;
                }).map((childId) => nodes[childId])
            );
        } else {
            currDepth += 1;
        }
    }
}

function search<T, S extends string>(
    nodes: StratifiedMap<T, S>,
    node: string,
    final: string,
    path: string[]
) {
    if (!nodes[node]) return false;

    if (node === final) {
        path.push(node);
        return true;
    }

    const children = nodes[node].children || [];

    for (const child of children) {
        if (search(nodes, child, final, path)) {
            path.push(node);
            return true;
        }
    }

    return false;
}

export function getPathTo<T, S extends string>(
    nodes: StratifiedMap<T, S>,
    from: string,
    to: string
): string[] {
    const path: string[] = [];

    const found = search(nodes, from, to, path);

    return found ? path.reverse() : [from];
}

export function treeLayout<T, S extends string>(
    nodes: StratifiedMap<T, S>,
    current: string,
    root: string
) {
    const depthMap: Record<string, number> = {};

    const currentPath = getPathTo(nodes, root, current);

    DFS(nodes, root, depthMap, currentPath);

    return currentPath;
}
