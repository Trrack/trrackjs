/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';
import {
  ChildNode,
  NodeId,
  RootNode,
  SnapshotNode,
  StateNode,
} from '../src/lib/graph/nodes/types';

type Node = RootNode<any, any> | ChildNode<any, any>;
type Nodes = { [key: NodeId]: Node };

type ProvenanceGraph = {
  nodes: Nodes;
  current: NodeId;
  root: NodeId;
};

function hash(input: string): string {
  return createHash('sha1').update(input).digest('hex');
}

type State = {
  count: number;
};

function createGraph(): ProvenanceGraph {
  const state: State = {
    count: 0,
  };

  const id = randomUUID();

  const root: RootNode<State> = {
    id,
    __hash: hash(id),
    payload: {
      type: 'state:snapshot',
      state,
    },
  } as any;

  const nodes: Nodes = {
    [root.id]: root,
  };

  return {
    nodes,
    root: root.id,
    current: root.id,
  };
}

function addNode(graph: ProvenanceGraph): ProvenanceGraph {
  const id = randomUUID();
  const parent = graph.current;
  const parentHash = graph.nodes[parent].hash;
  const newNode: SnapshotNode<State> = {
    id,
    __hash: hash(parentHash + id),
    payload: {
      type: 'state:snapshot',
      state: {
        count: 1,
      },
    },
    parent,
  } as any;

  return {
    ...graph,
    nodes: {
      ...graph.nodes,
      [newNode.id]: newNode,
    },
  };
}

function verify(graph: ProvenanceGraph): boolean {
  let current = graph.current;
  const root = graph.root;

  while (current) {
    const node = graph.nodes[current];

    if (current === root) {
      return hash(current) === node.hash;
    }

    const parent = graph.nodes[(node as any).parent];
    const parentHash = parent.hash;

    if (hash(parentHash + current) !== node.hash) {
      return false;
    }

    current = (node as any).parent;
  }
  return true;
}

describe('store', () => {
  it('should create a store', () => {
    let graph = createGraph();
    graph = addNode(graph);
    const v = verify(graph);
    console.log(graph);
    console.log(v);
  });
});
