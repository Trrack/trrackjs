import { BundleMap } from './BundleMap';

export default function findBundleParent(nodeId: string, bundleMap?: BundleMap): string[] {
  const parentList = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const bundle in bundleMap) {
    if (bundleMap[bundle].bunchedNodes.includes(nodeId)) {
      parentList.push(bundle);
    }
  }

  return parentList;
}
