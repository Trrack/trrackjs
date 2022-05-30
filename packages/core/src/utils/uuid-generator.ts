import { v5 } from 'uuid';

const NAMESPACE = '44693689-61ad-4038-966e-f59ff03d22b6';

export function getUUID(name: string = Math.random().toString()) {
  return v5(name, NAMESPACE);
}
