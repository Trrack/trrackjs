import { trrackableStore } from '@trrack/redux';

import { tasksSlice, testSlice } from '../features/todo/taskSlice';

const slices = { tasks: tasksSlice, test: testSlice };

export const { store, trrack } = trrackableStore(slices);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
