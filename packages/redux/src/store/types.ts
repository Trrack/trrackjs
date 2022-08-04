import { Middleware, Slice } from '@reduxjs/toolkit';
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';

export type SliceMapLike<State> = {
  [K in keyof State]: Slice<State[K]>;
};

export type StateFromSliceMap<M = any> = M extends SliceMapLike<any>
  ? { [P in keyof M]: M[P] extends Slice<infer S, any> ? S : never }
  : never;

export type Middlewares<State> = ReadonlyArray<
  Middleware<Record<string, unknown>, State>
>;

export type PossibleMiddleware<
  State = any,
  M extends Middlewares<State> = Middlewares<State>
> = ((g: CurriedGetDefaultMiddleware<State>) => M) | M;
