import { configureTrrackableStore } from '@trrack/redux';

import { counterSlice } from '../features/counter/counterSlice';
import { postSlice } from '../features/posts/postSlice';
import { tasksSlice } from '../features/todo/taskSlice';

export const { store, trrack, trrackStore } = configureTrrackableStore({
  reducer: {
    tasks: tasksSlice.reducer,
    counter: counterSlice.reducer,
    post: postSlice.reducer,
  },
  slices: [counterSlice, tasksSlice, postSlice],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
