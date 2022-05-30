import {
  AnyAction,
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
  createListenerMiddleware,
  Reducer,
  ReducersMapObject,
  TypedStartListening,
} from '@reduxjs/toolkit';
import { ActionRegistry, RegistryEntry, Trrack } from '@trrack/core';

import { isTrrackAction, TRRACK_ACTIONS, trrackApply } from './trrackActions';
import { SliceMapObject, StateFromSliceMapObject } from './types';

function makeTrrackable<State>(reducer: Reducer<State, AnyAction>) {
  return function (state: State | undefined, action: AnyAction) {
    switch (action.type) {
      case TRRACK_ACTIONS.APPLY_STATE:
        return reducer(action['payload'], action);
      default:
        return reducer(state, action);
    }
  };
}

function getReducersFromSlices<
  SMP extends SliceMapObject<any>,
  State extends StateFromSliceMapObject<SMP> = StateFromSliceMapObject<SMP>
>(slices: SMP): ReducersMapObject<State, AnyAction> {
  let reducerMap: ReducersMapObject<State, AnyAction> = null!;

  for (const slice in slices) {
    const sliceReducer = slices[slice].reducer;
    if (!reducerMap) {
      reducerMap = {
        [slice]: sliceReducer,
      } as ReducersMapObject<State, AnyAction>;
    }
    reducerMap = {
      ...reducerMap,
      [slice]: sliceReducer,
    };
  }

  if (reducerMap === null) throw new Error('No reducers in slices');

  return reducerMap;
}

export function trrackableStore<
  SMP extends SliceMapObject<any> = SliceMapObject<any>,
  State extends StateFromSliceMapObject<SMP> = StateFromSliceMapObject<SMP>
>(
  slices: SMP,
  opts?: Omit<ConfigureStoreOptions<State, AnyAction>, 'reducer' | 'middleware'>
) {
  const trrackListener = createListenerMiddleware();

  const allReducers = combineReducers({
    ...getReducersFromSlices(slices),
  });

  const trrackableReducers = makeTrrackable(allReducers);

  const store = configureStore({
    reducer: trrackableReducers,
    ...opts,
    middleware: (def) => def().prepend(trrackListener.middleware),
  });

  const startListening = trrackListener.startListening as TypedStartListening<
    ReturnType<typeof store.getState>,
    typeof store.dispatch
  >;

  let removeTrrackListener: ReturnType<typeof startListening> | null = null;

  const trrack = Trrack.initialize(
    ActionRegistry.create({
      apply: RegistryEntry.create({
        action: <T>(state: T) => {
          store.dispatch(trrackApply(state));
        },
        inverse: <T>(state: T) => {
          store.dispatch(trrackApply(state));
        },
      }),
    })
  );

  (window as any).provenance = () => {
    console.group('Trrack');
    console.log('Root', trrack.root.id);
    console.log('Current', trrack.current.id);
    console.table(trrack.getSerializedGraph().nodes);
    console.groupEnd();
  };

  function attachTrrack() {
    removeTrrackListener = startListening({
      predicate: (action) => {
        return isTrrackAction(action) ? false : true;
      },
      effect: (action, api) => {
        trrack.apply(
          {
            name: 'apply',
            label: action.type,
            doArgs: [api.getState()],
            undoArgs: [api.getOriginalState()],
          },
          true
        );
      },
    });
  }

  function removeTrrack() {
    if (removeTrrackListener) {
      removeTrrackListener();
    }
  }

  attachTrrack();

  return {
    store,
    attachTrrack,
    removeTrrack,
    trrack,
  };
}
