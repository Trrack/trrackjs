/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnyAction,
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
  createAction,
  createListenerMiddleware,
  Reducer,
  ReducersMapObject,
  Slice,
} from '@reduxjs/toolkit';
import { initializeTrrack, Registry } from '@trrack/core';

import {
  GENERATED_EVENT_MAP,
  isSliceTrrackable,
  LabelGenerator,
  LABELS,
  SIDEEFFECT_REDUCERS,
  SideEffectReducers,
  TrrackableSlice,
} from './createTrrackedSlice';

type SliceMap<State> = {
  [K in keyof State]: Slice<State[K]> | TrrackableSlice<State[K], any>;
};

type StateFromSliceMap<M = any> = M extends SliceMap<any>
  ? { [P in keyof M]: M[P] extends Slice<infer S, any> ? S : never }
  : never;

function getReducers<
  SMP extends SliceMap<any>,
  State extends StateFromSliceMap<SMP> = StateFromSliceMap<SMP>
>(slices: SMP): ReducersMapObject<State, AnyAction> {
  const reducerMap: ReducersMapObject<State, AnyAction> = {} as any;

  for (const slice in slices) {
    const sliceReducer = slices[slice].reducer;

    (reducerMap as any)[slice] = sliceReducer;
  }

  return reducerMap;
}

const TRRACK_UPDATE_STATE = 'update-state';
const TRRACK_TRAVESE_UPDATE = 'traverse-update';
const trrackTraverseUpdateAction = createAction(
  TRRACK_TRAVESE_UPDATE,
  function prepare<T>(state: T) {
    return {
      payload: state,
    };
  }
);

function makeTrrackable<State>(reducer: Reducer<State, AnyAction>) {
  return function (state: State | undefined, action: AnyAction) {
    if (action.type === TRRACK_TRAVESE_UPDATE)
      return reducer(action['payload'], action);
    else return reducer(state, action);
  };
}

export function createTrrackableStore<
  SMP extends SliceMap<any> = SliceMap<any>,
  State extends StateFromSliceMap<SMP> = StateFromSliceMap<SMP>
>(
  opts: Omit<ConfigureStoreOptions<State, AnyAction>, 'reducer'> & {
    slices: SMP;
  }
) {
  const reducer = makeTrrackable(
    combineReducers({
      ...getReducers(opts.slices),
    })
  );

  let labels: { [key: string]: LabelGenerator<any> } = {};

  let sideEffectReducers: SideEffectReducers<any> = {};

  let generatedEventMap: { [key: string]: string } = {};

  Object.values(opts.slices).forEach((slice) => {
    if (isSliceTrrackable(slice)) {
      labels = { ...labels, ...slice[LABELS] };

      sideEffectReducers = {
        ...sideEffectReducers,
        ...slice[SIDEEFFECT_REDUCERS],
      };

      generatedEventMap = {
        ...generatedEventMap,
        ...slice[GENERATED_EVENT_MAP],
      };
    }
  });

  const trrackMiddleware = createListenerMiddleware();

  const store = configureStore({
    reducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware().prepend(trrackMiddleware.middleware);
    },
  });

  const trrack = initializeTrrack({
    initialState: store.getState(),
    registry: Registry.create(),
  });

  Object.keys(sideEffectReducers).forEach((key) => {
    trrack.registry.register(key, (action: any) => {
      store.dispatch(action);
    });
  });

  const updateTrrack = trrack.registry.register(
    TRRACK_UPDATE_STATE,
    (_: State, newState: State) => {
      return newState;
    }
  );

  let pauseMiddleware = false;

  trrack.currentChange(() => {
    pauseMiddleware = true;
    store.dispatch(trrackTraverseUpdateAction(trrack.getState()));
    pauseMiddleware = false;
  });

  trrackMiddleware.startListening({
    predicate: () => {
      if (pauseMiddleware) return false;
      if (trrack.isTraversing) return false;

      return true;
    },
    effect: (action, listenerApi) => {
      const sideEffect = sideEffectReducers[action.type];

      const payload = action['payload'];

      const labelGenerator = labels[action.type];
      const label = labelGenerator(payload);

      if (sideEffect) {
        const doAct = action;
        const undoAct = sideEffect({
          originalPayload: payload,
          state: listenerApi.getState(),
        });

        undoAct.type = generatedEventMap[undoAct.type];

        trrack.record({
          label,
          state: {
            type: 'stateLike',
            val: {
              type: 'checkpoint',
              val: listenerApi.getState(),
            } as any,
          },
          eventType: 'Any',
          sideEffects: {
            do: [{ type: doAct.type, payload: doAct as any }],
            undo: [{ type: undoAct.type, payload: undoAct as any }],
          },
        });
      } else {
        trrack.apply(label, updateTrrack(listenerApi.getState()));
      }
    },
  });

  return { store, trrack };
}
