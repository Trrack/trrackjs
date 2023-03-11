import { Middleware, Slice } from '@reduxjs/toolkit';
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import { TrrackableSlice } from '../slice';

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

export type Trrackable<SM> = SM extends any
    ? {
          [K in keyof SM]: SM[K] extends TrrackableSlice ? K : never;
      }
    : never;

type T = {
    k: string;
};

type Temp<T> = T extends any
    ? {
          [K in keyof T]: T[K] extends string ? Slice | TrrackableSlice : never;
      }
    : never;

export type TT = Trrackable<Temp<T>>;
