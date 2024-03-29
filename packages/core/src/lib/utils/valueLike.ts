export type ValueLike<T> = T | ((...args: unknown[]) => T);

export function getValue<T>(obj: ValueLike<T>, ...args: unknown[]): T {
  return typeof obj === 'function'
    ? (obj as (...args: unknown[]) => T)(...args)
    : obj;
}
