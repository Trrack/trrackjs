import { v4 } from 'uuid';
import { BrandedId } from '../utils/branded_types';

export function getUUID<T extends BrandedId<string, unknown>>(): T {
  return v4() as T;
}
