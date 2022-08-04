import { PayloadAction } from '@reduxjs/toolkit';
import { createTrrackableSlice } from '@trrack/redux';
import { v4 as uuid } from 'uuid';

import { Todo } from './types';

const initialState: Todo[] = [];

export const tasksSlice = createTrrackableSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.push(action.payload);
      },
      prepare: (description: string) => {
        return {
          payload: {
            id: uuid(),
            description,
            completed: false,
          },
        };
      },
    },
    removeTodo(state, action: PayloadAction<string>) {
      const index = state.findIndex((t) => t.id === action.payload);
      state.splice(index, 1);
    },
    setTodoStatus(
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) {
      const index = state.findIndex((t) => t.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
  },
  labels: {
    setTodoStatus: (payload: { id: string; completed: boolean }) => {
      return `Mark ${payload.id} as ${
        payload.completed ? 'complete' : 'incomplete'
      }`;
    },
    addTodo: ((task: Todo) => {
      return `Add task ${task.description}`;
    }) as any,
  },
});

export const { addTodo, setTodoStatus, removeTodo } = tasksSlice.actions;
