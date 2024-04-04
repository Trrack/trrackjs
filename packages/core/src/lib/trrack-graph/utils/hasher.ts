/* eslint-disable @typescript-eslint/no-explicit-any */
import { SPEC_VERSION } from '../../version';
import { NodeId, TrrackNode } from '../nodes/types';
import { v5 } from 'uuid';

export function getNodeHash(
  node: NodeId | TrrackNode<any, any>,
  parentHash: string = ''
): string {
  return typeof node === 'string'
    ? getHash(node, parentHash)
    : getHash(node.id, parentHash);
}

export function getHash(data: string, ...rest: string[]): string {
  let _data = data;

  if (rest.length > 0) {
    _data = [data, ...rest].join('_');
  }

  return v5(_data, SPEC_VERSION);
}
