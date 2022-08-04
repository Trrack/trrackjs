import { createTrrackableSlice } from '@trrack/redux';

import { Counter, counterInitState } from './types';

export const counterSlice = createTrrackableSlice({
  name: 'counter',
  initialState: counterInitState,
  reducers: {
    increment(state: Counter) {
      state.counter += 1;
    },
    decrement(state: Counter) {
      state.counter -= 1;
    },
  },
  doUndoActionCreators: {
    increment: () => {
      return {
        undo: decrement(),
      };
    },
    decrement: () => {
      return {
        undo: increment(),
      };
    },
  },
});

export const { increment, decrement } = counterSlice.actions as any;
