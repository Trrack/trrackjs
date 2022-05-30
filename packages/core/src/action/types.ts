export type Action<K, DoArgs extends unknown[], UndoArgs extends unknown[]> = {
  name: K;
  label: string;
  doArgs: DoArgs;
  undoArgs: UndoArgs;
};
