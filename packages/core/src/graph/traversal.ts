import { INode } from './nodes';
import { RootNode } from './nodes/rootnode';
import { INonRootNode } from './nodes/types';

/**
 * Actual LCA algorithm
 * @param current Source node
 * @param destination Destination node
 * @param graphRecord Level and parent list of graph records
 * @returns least common ancestor of both current and destination nodes
 */
function LCA(current: INode, destination: INode) {
  let [source, target] = [current, destination];

  if (source.level > target.level) {
    [source, target] = [target, source];
  }

  let diff = target.level - source.level;

  while (RootNode.isNonRootNode(target) && diff !== 0) {
    target = target.parent;
    diff -= 1;
  }

  if (source.id === target.id) {
    return source;
  }

  while (source.id !== target.id) {
    if (RootNode.isNonRootNode(source)) source = source.parent;
    if (RootNode.isNonRootNode(target)) target = target.parent;
  }

  return source;
}

/**
 * Determine a path between current and destination using LCA algorithm.
 * @param current The node the graph currently is at.
 * @param destination The node we want to go to.
 * @returns A string of node ids which indicate the path.
 */
export function getPathToNode(current: INode, destination: INode) {
  const lca = LCA(current, destination);

  const pathFromSourceToLca: INode[] = [];
  const pathFromTargetToLca: INode[] = [];

  let [source, target] = [current, destination];

  while (source !== lca) {
    pathFromSourceToLca.push(source);
    if (RootNode.isNonRootNode(source)) {
      source = source.parent;
    }
  }
  pathFromSourceToLca.push(source);

  while (target !== lca) {
    pathFromTargetToLca.push(target);
    if (RootNode.isNonRootNode(target)) {
      target = <INonRootNode>target.parent;
    }
  }

  const path = [...pathFromSourceToLca, ...pathFromTargetToLca.reverse()];
  return path;
}

/**
 *  Determine if we are going up when we move from source to target
 * @param source - Where we start
 * @param target  - Where we end
 * @param graphRecord - Leve and parent list
 * @returns True if we are going up in the provenance graph, else return false.
 * Throw an error if both the nodes are disconnected
 */
export function isNextNodeUp(source: INode, target: INode): boolean {
  if (RootNode.isNonRootNode(source) && source.parent.id === target.id) {
    return true;
  } else if (RootNode.isNonRootNode(target) && target.parent.id === source.id) {
    return false;
  }

  throw new Error(
    `Illegal use of function. Nodes ${source} and ${target} are not connected.`
  );
}
