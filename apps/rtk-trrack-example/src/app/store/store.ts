import { createTrrackableStore } from '@trrack/redux';

import { counterSlice, tasksSlice } from '../features/todo/taskSlice';

export const { store, trrack, trrackStore } = createTrrackableStore({
  slices: { tasks: tasksSlice, counter: counterSlice },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
