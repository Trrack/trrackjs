import { Immutable } from 'immer';

export type DefaultObjectType = Record<string, unknown>;

export type LabelLike = string | ((...args: unknown[]) => string);

export type NoImmutable<T extends Immutable<unknown>> = T extends Immutable<
  infer R
>
  ? R
  : never;
