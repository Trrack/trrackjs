/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueLike } from './valueLike';

export type DefaultObjectType = Record<string, unknown>;

export type LabelLike = ValueLike<string>;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
