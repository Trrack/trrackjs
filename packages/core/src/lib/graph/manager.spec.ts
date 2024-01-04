import { createProvenanceGraphManager } from './manager';
import { createStateNode } from './nodes';

describe('createProvenanceGraphManager', () => {
  it('returns a ProvenanceGraphManager object', () => {
    const manager = createProvenanceGraphManager({});

    expect(manager).toBeDefined();
    expect(manager).toHaveProperty('getGraph');
    expect(manager).toHaveProperty('changeCurrentNode');
    expect(manager).toHaveProperty('addNode');
    expect(manager).toHaveProperty('load');
  });

  it('getGraph returns a ProvenanceGraph', () => {
    const manager = createProvenanceGraphManager({});

    const graph = manager.getGraph();

    expect(graph).toBeDefined();
    expect(graph.nodes).toBeDefined();
    expect(graph.current).toBeDefined();
    expect(graph.root).toBeDefined();
  });

  it('new provenance graph is valid', () => {
    const manager = createProvenanceGraphManager({});
    const graph = manager.getGraph();

    expect(Object.keys(graph.nodes).length).toBe(1);
    expect(graph.root).toBe(graph.current);
    expect(graph.nodes[graph.root].id).toBe(graph.root);
    expect(graph.nodes[graph.current].id).toBe(graph.current);
  });

  it('addNode adds a node to the graph', async () => {
    type State = {
      a: number;
      b: number;
    };

    const manager = createProvenanceGraphManager<State>({
      a: 1,
      b: 1,
    });

    const preGraph = manager.getGraph();

    const node = createStateNode<State>({
      parent: preGraph.nodes[preGraph.current],
      stateLike: {
        type: 'snapshot',
        state: {
          a: 1,
          b: 2,
        },
      },
      label: 'My State',
      event: 'My Event',
    });

    await manager.addNode(node);

    const graph = manager.getGraph();

    expect(Object.keys(graph.nodes).length).toBe(2);
    expect(graph.nodes[node.id]).toEqual(node);
    expect(graph.nodes[node.parent].children).toContain(node.id);
    expect(graph.current).toBe(node.id);
  });

  it('changeCurrentNode changes the current node', async () => {
    type State = {
      a: number;
      b: number;
    };

    const manager = createProvenanceGraphManager<State>({
      a: 1,
      b: 1,
    });

    const preGraph = manager.getGraph();

    const node1 = createStateNode<State>({
      parent: preGraph.nodes[preGraph.current],
      stateLike: {
        type: 'snapshot',
        state: {
          a: 1,
          b: 2,
        },
      },
      label: 'My State',
      event: 'My Event',
    });

    await manager.addNode(node1);

    const preGraph2 = manager.getGraph();

    const node2 = createStateNode<State>({
      parent: preGraph2.nodes[preGraph2.current],
      stateLike: {
        type: 'snapshot',
        state: {
          a: 1,
          b: 2,
        },
      },
      label: 'My State',
      event: 'My Event',
    });

    await manager.addNode(node2);

    expect(manager.getGraph().current).toBe(node2.id);

    await manager.changeCurrentNode(node1.id);

    expect(manager.getGraph().current).toBe(node1.id);

    await manager.changeCurrentNode(manager.getGraph().root);

    expect(manager.getGraph().current).toBe(manager.getGraph().root);
  });

  it('load loads a graph', async () => {
    type State = {
      a: number;
      b: number;
    };

    const state1 = {
      a: 1,
      b: 1,
    };
    const manager1 = createProvenanceGraphManager<State>(state1);

    const preGraph = manager1.getGraph();

    const node = createStateNode<State>({
      parent: preGraph.nodes[preGraph.current],
      stateLike: {
        type: 'snapshot',
        state: {
          a: 1,
          b: 2,
        },
      },
      label: 'My State',
      event: 'My Event',
    });

    await manager1.addNode(node);

    const graph1 = manager1.getGraph();

    const state2: State = { a: 3, b: 1 };
    const manager2 = createProvenanceGraphManager<State>(state2);

    expect(manager2.getGraph().root).not.toBe(graph1.root);

    await manager2.load(graph1);
    expect(manager2.getGraph()).toBe(graph1);
  });
});
