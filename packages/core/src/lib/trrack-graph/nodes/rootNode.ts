/* eslint-disable @typescript-eslint/ban-types */
import { getDateTime } from '../../utils/datetime';
import { SPEC_VERSION } from '../../version';
import { getNodeHash } from '../utils/hasher';
import { getNodeId } from '../utils/nodeId';
import { TrrackNode, RootNode } from './types';

type RootNodeCreationOpts<Metadata extends {} = {}> = Partial<{
  author: string;
  label: string;
  type: string;
  metadata: Metadata;
}>;

export function createRootNode<State, Metadata extends {} = {}>(
  state: State,
  opts: RootNodeCreationOpts<Metadata> = {}
): RootNode<State, Metadata> {
  const {
    author = 'unknown',
    label = 'Root Node',
    type = 'initialize',
    ...metadata
  } = opts;

  const id = getNodeId();
  const hash = getNodeHash(id);

  const root: RootNode<State, Metadata> = {
    id,
    hash,
    __root: true,
    __nodeType: 'snapshot',
    label,
    type,
    payload: {
      type: 'state:snapshot',
      state,
    },
    metadata: {
      createdOn: getDateTime(),
      specVersion: SPEC_VERSION,
      author,
      ...(metadata as Metadata),
    },
    children: [],
  };

  return root;
}

export function isRootNode<State, Metadata>(
  node: TrrackNode<State, Metadata>
): node is RootNode<State, Metadata> {
  return node.__root;
}
// {
//   id: '97244deb-f4b2-45b7-a1a4-3ae098cd1280',
//   __root: true,
//   __nodeType: 'snapshot',
//   label: 'Root Node',
//   type: 'initialize',
//   payload: { type: 'state:snapshot', state: { count: 0 } },
//   metadata: {
//     createdOn: '2024-04-02T22:29:23.009Z',
//     specVersion: '0.0.0',
//     author: 'unknown'
//   },
//   children: []
// }
