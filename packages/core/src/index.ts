/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
export type Trrack<State> = {
  getState(): State;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type CombinedType<Plugins extends Array<Plugin<any, any>>> =
  UnionToIntersection<
    {
      [P in keyof Plugins]: Plugins[P] extends Plugin<any, infer U> ? U : never;
    }[never]
  >;

type CreatorFunction<State, Api = {}> = (state: State) => Api & Trrack<State>;

type Plugin<State, Api = {}> = (
  creator: CreatorFunction<State>
) => CreatorFunction<State, Api>;

export function createTrrack<State, Plugins extends Array<Plugin<State, any>>>(
  initialState: State,
  plugins: [...Plugins]
): Trrack<State> & CombinedType<Plugins> {
  let creator: CreatorFunction<State> = _createTrrack as CreatorFunction<State>;

  console.log('Creating with plugin');

  plugins.forEach((plugin, idx) => {
    console.log(`Adding plugin: ${idx}`);
    creator = plugin(creator);
  });

  return creator(initialState) as Trrack<State> & CombinedType<Plugins>;
}

function _createTrrack<State>(initialState: State): Trrack<State> {
  console.log('_createTrrack');

  function getState(): State {
    return initialState;
  }

  const trrack: Trrack<State> = {
    getState,
  };

  return trrack;
}

type LoggerApi = {
  log(): void;
};

function loggerPlugin(): Plugin<any, LoggerApi> {
  return (create) => (initialState) => {
    const trrack = create(initialState);

    return {
      ...trrack,
      log() {
        console.log(trrack.getState());
      },
    };
  };
}

function serializePlugin(): Plugin<any, { serialize(): string }> {
  return (create) => (initialState) => {
    const trrack = create(initialState);

    return {
      ...trrack,
      serialize: () => {
        return JSON.stringify(trrack.getState());
      },
    };
  };
}

function deserializePlugin<State>(): Plugin<
  State,
  { deserialize(arg: string): State }
> {
  return <State>(create: CreatorFunction<State>) =>
    <S extends State = State>(initialState: S) => {
      const trrack = create(initialState);
      return {
        ...trrack,
        deserialize(serializedString: string): State {
          return JSON.parse(serializedString) as unknown as State;
        },
      };
    };
}

export function run() {
  type State = { count: number };
  const plugins = [
    loggerPlugin(),
    serializePlugin(),
    deserializePlugin<State>(),
  ];
  const trrack = createTrrack<State, typeof plugins>({ count: 0 }, plugins);

  trrack.log();

  const serialized = trrack.serialize();

  const deserialized = trrack.deserialize(serialized);
  console.log(deserialized);
}
