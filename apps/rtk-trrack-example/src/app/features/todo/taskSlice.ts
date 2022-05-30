import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import { Todo } from './types';

const initialState: Todo[] = [];

export const tasksSlice = createSlice({
  name: "tasks",
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
});

export const { addTodo, removeTodo, setTodoStatus } = tasksSlice.actions;

type Test = {
  foo: string;
  bar: {
    bazz: string;
  };
};

const testInit: Test = {
  foo: "hello",
  bar: {
    bazz: "world",
  },
};

export const testSlice = createSlice({
  name: "testing",
  initialState: testInit,
  reducers: {
    changeName(state, action: PayloadAction<string>) {
      state.bar.bazz = action.payload;
    },
  },
});

export const { changeName } = testSlice.actions;
