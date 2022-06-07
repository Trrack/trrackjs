export type Action<
  K extends string = string,
  DoArgs extends unknown[] = unknown[],
  UndoArgs extends unknown[] = unknown[]
> = {
  name: K;
  label: string;
  doArgs: DoArgs;
  undoArgs: UndoArgs;
};
