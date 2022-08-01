import { PayloadAction } from '@reduxjs/toolkit';

import { createTrrackableSlice, createTrrackableStore } from '../src';

describe('it', () => {
  it('should work', () => {
    const slice = createTrrackableSlice({
      name: 'hello-slice',
      initialState: {
        who: 'World',
      },
      reducers: {
        change(state: { who: string }, action: PayloadAction<string>) {
          state.who = action.payload;
        },
        reset() {
          return { who: 'World' };
        },
      },
      labels: {
        change(who: string) {
          return `Say hello to ${who}!`;
        },
      },
      eventTypes: {
        change: 'Change',
      },
    });

    const { store } = createTrrackableStore({
      slices: {
        hello: slice,
      },
    });

    store.dispatch(slice.actions.change('Mars'));

    expect(true).toBeTruthy();
  });
});
