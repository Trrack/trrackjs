/* eslint-disable no-restricted-syntax */

import { BundleMap } from './BundleMap';

export default function findBackboneBundleNodes(nodeMap: any, bundleMap?: BundleMap): string[] {
  const backboneBundleNodes: string[] = [];
  const bundles = bundleMap ?? {};

  for (const [bundle, bundleInfo] of Object.entries(bundles)) {
    let flag = true;
    const bundleNode = nodeMap[bundle];

    if (!bundleNode || bundleNode.width !== 0) {
      flag = false;
    }

    for (const i of bundleInfo.bunchedNodes) {
      if (!nodeMap[i] || nodeMap[i].width !== 0) {
        flag = false;
      }
    }

    if (flag) {
      backboneBundleNodes.push(bundle);
      for (const n of bundleInfo.bunchedNodes) {
        backboneBundleNodes.push(n);
      }
    }
  }

  return backboneBundleNodes;
}
