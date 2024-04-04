/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Trrack } from '../trrack';
import { UnionToIntersection } from '../utils/types';

export type TrrackPlugin<State, Api = {}> = (trrack: Trrack<State>) => Api;

export type CombinedType<TrrackPlugins extends Array<TrrackPlugin<any, any>>> =
  UnionToIntersection<
    {
      [P in keyof TrrackPlugins]: TrrackPlugins[P] extends TrrackPlugin<
        any,
        infer U
      >
        ? U
        : never;
    }[never]
  >;
