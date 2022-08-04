import { createAsyncThunk } from '@reduxjs/toolkit';
import { asyncDoUndoActionCreatorHelper, createTrrackableSlice } from '@trrack/redux';

export const getPostById = createAsyncThunk(
  'post/getpostById',
  async (postId: number, api) => {
    if (postId < 1) {
      return Promise.resolve({
        userId: -1,
        id: -1,
        title: '',
        body: '',
      });
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );

    return response.json();
  }
);

export const postSlice = createTrrackableSlice({
  name: 'post',
  initialState: {
    userId: -1,
    id: -1,
    title: '',
    body: '',
  },
  reducers: {},
  asyncThunks: [getPostById],
  extraReducers(builder) {
    builder.addCase(getPostById.fulfilled, (_, action) => {
      return action.payload;
    });
  },
  doUndoActionCreators: {
    [getPostById.typePrefix]: ({ action }) => {
      return {
        do: asyncDoUndoActionCreatorHelper(
          getPostById.typePrefix,
          action.payload.id - 1
        ),
        undo: asyncDoUndoActionCreatorHelper(
          getPostById.typePrefix,
          action.payload.id - 1
        ),
      };
    },
  },
});
