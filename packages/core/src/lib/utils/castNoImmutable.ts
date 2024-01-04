import { Immutable } from 'immer';
import { NoImmutable } from './types';

export function castNoImmutable<T extends Immutable<unknown>>(
  obj: T
): NoImmutable<T> {
  return obj as NoImmutable<T>;
}
