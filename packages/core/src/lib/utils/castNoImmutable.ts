import { Immutable } from 'immer';

export type NoImmutable<T extends Immutable<unknown>> = T extends Immutable<
  infer R
>
  ? R
  : never;

export function castNoImmutable<T extends Immutable<unknown>>(
  obj: T
): NoImmutable<T> {
  return obj as NoImmutable<T>;
}
