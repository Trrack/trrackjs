import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodeId } from '@trrack/core';

export type TrrackSliceState = {
  current: NodeId;
};

const initialState: TrrackSliceState = {
  current: null as any,
};

const trrackSlice = createSlice({
  name: 'trrack',
  initialState,
  reducers: {
    changeCurrent(_state, action: PayloadAction<NodeId>) {
      return {
        current: action.payload,
      };
    },
  },
});

export const { changeCurrent } = trrackSlice.actions;

export function getTrrackStore(init: TrrackSliceState) {
  return configureStore({
    reducer: trrackSlice.reducer,
    preloadedState: init as any,
  });
}
