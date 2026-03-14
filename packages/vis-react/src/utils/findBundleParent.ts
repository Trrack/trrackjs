import { BundleMap } from './BundleMap';

export default function findBundleParent(nodeId: string, bundleMap: BundleMap = {}): string[] {
  const parentList: string[] = [];

  for (const [bundle, bundleInfo] of Object.entries(bundleMap)) {
    if (bundleInfo.bunchedNodes.includes(nodeId)) {
      parentList.push(bundle);
    }
  }

  return parentList;
}
