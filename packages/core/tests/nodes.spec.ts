import { compare } from 'fast-json-patch';
import { createRootNode, createStateNode } from '../src/lib/graph/nodes';
import { SPEC_VERSION } from '../src/lib/trrack/version';

const DEFAULT_ROOT_LABEL = 'Root';

describe('createRootNode', () => {
  it('returns a RootNode object', () => {
    const root = createRootNode({ initialState: {} });

    expect(root).toBeDefined();
    expect(root).toHaveProperty('id');
    expect(root).toHaveProperty('createdOn');
    expect(root).toHaveProperty('stateLike');
    expect(root).toHaveProperty('spec_version');
    expect(root).toHaveProperty('author');
    expect(root).toHaveProperty('label');
    expect(root).toHaveProperty('event');
    expect(root).toHaveProperty('children');
  });

  it('root.id is a v4 UUID', () => {
    const root = createRootNode({ initialState: {} });

    expect(root.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89a-b][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('root.createdOn is valid ISO DateTime string', () => {
    const root = createRootNode({ initialState: {} });

    expect(root.createdOn).toMatch(
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]+?Z$/
    );
  });

  it('root.stateLike is a snapshot and matches initial state', () => {
    const initialState = { a: 1, b: 2 };

    const root = createRootNode({ initialState });

    expect(root.stateLike).toEqual({ type: 'snapshot', state: initialState });
  });

  it('root.spec_version is the current spec version', () => {
    const root = createRootNode({ initialState: {} });
    expect(root.spec_version).toBe(SPEC_VERSION);
  });

  it('root.author is a v4 UUID', () => {
    const root = createRootNode({ initialState: {} });

    expect(root.author).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89a-b][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it(`root.label matches "${DEFAULT_ROOT_LABEL}" when nothing is provided`, () => {
    const root = createRootNode({ initialState: {} });

    expect(root.label).toBe(DEFAULT_ROOT_LABEL);
  });

  it('root.label matches provided label', () => {
    const label = 'My Label';
    const root = createRootNode({ initialState: {}, label });

    expect(root.label).toBe(label);
  });

  it('root.event matches "Graph Creation"', () => {
    const root = createRootNode({ initialState: {} });

    expect(root.event).toBe('Graph Creation');
  });

  it('root.children is an empty array', () => {
    const root = createRootNode({ initialState: {} });

    expect(root.children).toEqual([]);
  });
});

describe('createStateNode', () => {
  it('returns a StateNode object', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node).toBeDefined();

    expect(node).toHaveProperty('createdOn');
    expect(node).toHaveProperty('stateLike');
    expect(node).toHaveProperty('spec_version');
    expect(node).toHaveProperty('author');
    expect(node).toHaveProperty('label');
    expect(node).toHaveProperty('event');
    expect(node).toHaveProperty('parent');
    expect(node).toHaveProperty('children');
  });

  it('node.id is a v4 UUID', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89a-b][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('node.createdOn is valid ISO DateTime string', () => {
    const initialState = { a: 1, b: 2 };

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {
          a: 3,
          b: 5,
        },
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.createdOn).toMatch(
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]+?Z$/
    );
  });

  it('node.stateLike is a snapshot and matches the state passed to the fn', () => {
    const initialState = { a: 1, b: 2 };

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const newState = { a: 3, b: 4 };

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: newState,
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.stateLike).toEqual({ type: 'snapshot', state: newState });
  });

  it('node.stateLike is a diff and matches the state passed to the fn', () => {
    const initialState = { a: 1, b: 2 };

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const newState = { a: 3, b: 4 };

    const diffs = compare(initialState, newState);

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'diff',
        lastSnapshotNodeId: root.id,
        diffs,
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.stateLike).toEqual({
      type: 'diff',
      diffs,
      lastSnapshotNodeId: root.id,
    });
  });

  it('node.spec_version is the current spec version', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.spec_version).toBe(SPEC_VERSION);
  });

  it('node.author is a v4 UUID', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.author).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89a-b][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('node.label matches provided label', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const label = 'My Label';

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label,
      event: 'My Event',
    });

    expect(node.label).toBe(label);
  });

  it('node.event matches provided event', () => {
    const event = 'My Event';

    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event,
    });

    expect(node.event).toBe(event);
  });

  it('node.parent matches provided parent id', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.parent).toBe(root.id);
  });

  it('node.children is an empty array', () => {
    const initialState = {};

    const root = createRootNode<typeof initialState>({
      initialState,
    });

    const node = createStateNode({
      parent: root,
      stateLike: {
        type: 'snapshot',
        state: {},
      },
      label: 'My State',
      event: 'My Event',
    });

    expect(node.children).toEqual([]);
  });

  //
});
