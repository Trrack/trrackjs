import { ActionCreatorWithPreparedPayload, Slice } from '@reduxjs/toolkit';

export type SliceMapObject<S = any> = {
  [K in keyof S]: Slice<S[K], any>;
};

export type StateFromSliceMapObject<M> = M extends SliceMapObject<any>
  ? { [P in keyof M]: M[P] extends Slice<infer S, any> ? S : never }
  : never;

export type TrrackApplyAction<T> = ActionCreatorWithPreparedPayload<
  [state: T],
  any,
  string,
  never,
  never
>;
