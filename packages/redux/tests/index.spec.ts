import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { configureTrrackableStore, createTrrackableSlice } from '../src';

describe('it', () => {
  it('should work', () => {
    const getPostById = createAsyncThunk(
      'test/getpostById',
      async (postId: number, api) => {
        const response = await fetch(
          ` https://jsonplaceholder.typicode.com/posts/${postId} `
        );

        return response.json();
      }
    );

    const testSlice = createTrrackableSlice({
      name: 'test',
      initialState: {
        hello: 'World',
        post: {
          userId: -1,
          id: -1,
          title: '',
          body: '',
        },
      },
      reducers: {
        sayHello(state, action: PayloadAction<string>) {
          state.hello = action.payload;
        },
      },
      extraReducers: (builder) => {
        builder.addCase(getPostById.fulfilled, (state, action) => {
          state.post = action.payload;
        });
      },
      labels: {
        sayHello: (args) => `Say hello to ${args}`,
      },
      doUndoActionCreators: {
        sayHello({ previousState }) {
          return {
            undo: sayHello(previousState.test.hello),
          };
        },
      },
    });

    const { sayHello } = testSlice.actions as any;

    const { store, trrack } = configureTrrackableStore({
      reducer: {
        test: testSlice.reducer,
      },
      slices: [testSlice],
    });

    // store.dispatch(sayHello('Mars'));
    // trrack.undo();

    expect(true).toBeTruthy();
  });
});
