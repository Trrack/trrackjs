export type Store<State> = {
  state: State;
};

export type TrrackStoreCreator = <State, T>(reg: T) => Store<State>;

export type TrrackEnchancer = (next: TrrackStoreCreator) => TrrackStoreCreator;

export function compose<T>(...fns: Array<(arg: T) => T>) {
  if (!fns || fns.length === 0) {
    return <X>(a: X) => a;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)));
}

export const enh2 =
  (storeCreator: TrrackStoreCreator) =>
  <State, T>(reg: T) => {
    const store = storeCreator<State, T>(reg);

    console.log(store);
    console.log('After Enhancing 2');
    return { ...store, test2: 4 };
  };

export const enh =
  (storeCreator: TrrackStoreCreator) =>
  <State, T>(reg: T) => {
    const store = storeCreator<State, T>(reg);

    console.log(store);
    console.log('After Enhancing');
    return { ...store, test: 3 };
  };

export type TrrackPluginAPI<T> = {
  api: T;
};

export type TrrackPlugin = (
  api: TrrackPluginAPI<any>
) => (next: (action: unknown) => unknown) => (action: unknown) => unknown;

export function applyMiddleware(...plugins: TrrackPlugin[]): TrrackEnchancer {}

export function createStore<State, T>(
  reg: T,
  enhancers: TrrackEnchancer | Array<TrrackEnchancer> = [] // Applied left to right
): Store<State> {
  const trrackEnhancers = Array.isArray(enhancers) ? enhancers : [enhancers];

  const store: Store<State> =
    enhancers.length > 0
      ? compose(...trrackEnhancers)(createStore)(reg)
      : {
          state: {} as State,
        };

  return store;
}

export function run() {
  const store = createStore(1, [enh, enh2]);
  console.log(store);
  return store;
}
