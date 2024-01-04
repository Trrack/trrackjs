import { createTrrack } from './api';

type State = {
  a: number;
  b: number;
};

const initialState: State = {
  a: 1,
  b: 2,
};

function setup(onlyCreate: boolean = false) {
  const trrack = createTrrack({
    initialState,
  });
  if (!onlyCreate) {
    //
  }

  return trrack;
}

describe('createTrrack', () => {
  it('trrack.done finishes setup', async () => {
    expect(false).toBeTruthy();
  });

  it('returns a Trrack object', () => {
    const trrack = createTrrack({
      initialState,
    });

    expect(trrack).not.toBeNull();
    expect(trrack).toBeDefined();
    expect(trrack).toHaveProperty('__unsafe');
    expect(trrack).toHaveProperty('__backend');
    expect(trrack).toHaveProperty('getInitialState');
    expect(trrack).toHaveProperty('getState');
    expect(trrack).toHaveProperty('current');
    expect(trrack).toHaveProperty('root');
    expect(trrack).toHaveProperty('to');
    expect(trrack).toHaveProperty('undo');
    expect(trrack).toHaveProperty('redo');
    expect(trrack).toHaveProperty('done');
  });

  it('trrack.__unsafe has proper shape', () => {
    const trrack = setup(true);

    expect(trrack.__unsafe).toBeDefined();
    expect(Object.keys(trrack.__unsafe)).toHaveLength(0);
  });

  it('trrack.__backend has proper shape', () => {
    const trrack = setup(true);

    expect(trrack.__backend).toBeDefined();
    expect(trrack.__backend).toHaveProperty('registry');
    expect(trrack.__backend).toHaveProperty('graph');
  });

  it('trrack.__backend.registry is an ActionRegistry', () => {
    const trrack = setup(true);

    expect(trrack.__backend.registry).toBeDefined();
    expect(trrack.__backend.registry).toHaveProperty('listActions');
    expect(trrack.__backend.registry).toHaveProperty('has');
    expect(trrack.__backend.registry).toHaveProperty('addAction');
    expect(trrack.__backend.registry).toHaveProperty('execute');
  });

  it('trrack.__backend.graph is a ProvenanceGraph', () => {
    const trrack = setup(true);
    const graph = trrack.__backend.graph();

    expect(graph).toBeDefined();
    expect(graph).toHaveProperty('root');
    expect(graph).toHaveProperty('current');
    expect(graph).toHaveProperty('nodes');
  });

  it('trrack.getInitialState returns the initial state', () => {
    const trrack = setup(true);

    const state = trrack.getInitialState();

    expect(state).toBeDefined();
    expect(state).toHaveProperty('a');
    expect(state.a).toBe(1);
    expect(state).toHaveProperty('b');
    expect(state.b).toBe(2);
  });

  it('trrack.getState returns the current state', () => {
    const trrack = setup();
    const state = trrack.getState();

    expect(state).toBeDefined();
    expect(state).toHaveProperty('a');
    expect(state.a).toBe(1);
    expect(state).toHaveProperty('b');
    expect(state.b).toBe(2);

    expect(false).toBeTruthy();
  });

  it('trrack.getState returns the state at a specific node', async () => {
    const trrack = setup();

    // Do Something here
    const state = trrack.getState();

    expect(state).toBeDefined();
    expect(state).toHaveProperty('a');
    expect(state.a).toBe(1);
    expect(state).toHaveProperty('b');
    expect(state.b).toBe(1);
    expect(false).toBeTruthy();
  });

  it('trrack.current is the current node', () => {
    expect(false).toBeTruthy();
  });

  it('trrack.root is the root node', () => {
    expect(false).toBeTruthy();
  });

  it('trrack.to changes the current node', async () => {
    expect(false).toBeTruthy();
  });

  it('trrack.undo goes to previous node', async () => {
    expect(false).toBeTruthy();
  });

  it('trrack.redo goes to next node', async () => {
    expect(false).toBeTruthy();
  });

  //
});
