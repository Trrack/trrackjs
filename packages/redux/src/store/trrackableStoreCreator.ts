/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Action,
  AnyAction,
  AsyncThunk,
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
  createAction,
  createListenerMiddleware,
  PayloadAction,
  Reducer,
  Slice,
  TypedStartListening,
} from '@reduxjs/toolkit';
import { initializeTrrack, Registry } from '@trrack/core';

import { isSliceTrrackable } from '../slice';
import {
  ACTION_NAME_TYPE_MAP,
  ASYNC_THUNKS,
  DO_UNDO_ACTION_CREATORS,
  GeneratedDoUndoActionCreators,
  LabelGenerators,
  LABELS,
  NO_OP_ACTION,
} from '../slice/types';
import { changeCurrent, getTrrackStore } from './trrackStore';

// Fin.

export const trrackTraverseAction = createAction('traverse', function prepare<
  T
>(state: T) {
  return {
    payload: state,
  };
});

function isTraverseAction(
  action: AnyAction
): action is ReturnType<typeof trrackTraverseAction> {
  return action.type === trrackTraverseAction.type;
}

function makeTrrackable<State, A extends Action = AnyAction>(
  reducer: Reducer<State, A>
) {
  return function (state: State | undefined, action: A) {
    if (isTraverseAction(action))
      return reducer(action.payload as State, action);
    return reducer(state, action);
  };
}

function mergeLabels(slices: Slice[]) {
  return slices.reduce((acc, slice) => {
    if (isSliceTrrackable(slice)) {
      return { ...acc, ...slice[LABELS] };
    }
    return acc;
  }, {} as LabelGenerators);
}

function mergeDoUndoActionCreators(slices: Slice[]) {
  return slices.reduce((acc, slice) => {
    if (isSliceTrrackable(slice)) {
      return { ...acc, ...slice[DO_UNDO_ACTION_CREATORS] };
    }
    return acc;
  }, {} as GeneratedDoUndoActionCreators);
}

function mergeReducerEventTypes(slices: Slice[]) {
  return slices.reduce((acc, slice) => {
    if (isSliceTrrackable(slice)) {
      return { ...acc, ...slice[ACTION_NAME_TYPE_MAP] };
    }
    return acc;
  }, {} as { [key: string]: string });
}

function mergeAsyncThunks(slices: Slice[]) {
  return slices.reduce((acc, slice) => {
    if (isSliceTrrackable(slice)) {
      return [...acc, ...slice[ASYNC_THUNKS]];
    }
    return acc;
  }, [] as Array<AsyncThunk<any, any, any>>);
}

export function configureTrrackableStore<State>(
  opts: ConfigureStoreOptions<State, AnyAction> & {
    slices: Slice[];
  }
) {
  const trrackMiddleware = createListenerMiddleware();

  const _reducer = opts.reducer;

  const store = configureStore({
    ...opts,
    reducer: makeTrrackable(
      typeof _reducer === 'function' ? _reducer : combineReducers(_reducer)
    ),
    middleware(getDefaultMiddleware) {
      const suppliedMiddleware = opts.middleware;
      if (!suppliedMiddleware)
        return getDefaultMiddleware().prepend(trrackMiddleware.middleware);
      if (typeof suppliedMiddleware === 'function') {
        return [
          ...suppliedMiddleware(getDefaultMiddleware),
          trrackMiddleware.middleware,
        ];
      }
      return [...suppliedMiddleware, trrackMiddleware.middleware];
    },
  });

  /**
   * Create types for listener
   */
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;

  type AppStartListening = TypedStartListening<RootState, AppDispatch>;
  const startListening = trrackMiddleware.startListening as AppStartListening;
  // Fin.

  const labels = mergeLabels(opts.slices);
  const doUndoActionCreators = mergeDoUndoActionCreators(opts.slices);
  const reducerEventTypes = mergeReducerEventTypes(opts.slices);
  const asyncThunks = mergeAsyncThunks(opts.slices);

  const trrack = initializeTrrack({
    initialState: store.getState(),
    registry: Registry.create(),
  });

  asyncThunks.forEach((thunk) => {
    trrack.registry.register(thunk.typePrefix, (args: any) => {
      return store.dispatch(thunk(args) as any);
    });
  });

  opts.slices.forEach((slice) => {
    Object.values(slice.actions).forEach((action) => {
      trrack.registry.register(action.type, (act: AnyAction) => {
        store.dispatch(act);
      });
    });
  });

  const trrackStore = getTrrackStore({
    current: trrack.current.id,
  });

  let middlewareStatus: 'active' | 'paused' = 'active';

  trrack.currentChange(() => {
    middlewareStatus = 'paused';
    store.dispatch(trrackTraverseAction(trrack.getState()));
    trrackStore.dispatch(changeCurrent(trrack.current.id));
    middlewareStatus = 'active';
  });

  startListening({
    predicate() {
      if (trrack.isTraversing) return false;
      return middlewareStatus === 'active';
    },
    effect(action, api) {
      if (
        asyncThunks.some(
          (thunk) => thunk.pending.match(action) || thunk.rejected.match(action)
        ) ||
        !action.type
      ) {
        return;
      }

      const possibleTypes = asyncThunks
        .filter((thunk) => thunk.fulfilled.match(action))
        .map((t) => t.typePrefix);

      if (possibleTypes.length > 1) throw new Error('Error with async action.');

      const type = possibleTypes.length === 1 ? possibleTypes[0] : action.type;

      const isThunk = possibleTypes.length === 1;

      const payload = action['payload'];
      const labelGenerator = labels[type];

      const label = labelGenerator(payload);

      const doUndoObject = doUndoActionCreators[type]({
        action: action as PayloadAction,
        currentState: api.getState(),
        previousState: api.getOriginalState(),
      });

      const hasSideEffects = !NO_OP_ACTION.match(doUndoObject.undo);

      if (hasSideEffects) {
        const undoAct = doUndoObject.undo as PayloadAction;
        const doAct = NO_OP_ACTION.match(doUndoObject.do)
          ? (action as PayloadAction)
          : (doUndoObject.do as PayloadAction);

        trrack.record({
          label,
          state: {
            type: 'stateLike',
            val: {
              type: 'checkpoint',
              val: api.getState(),
            } as any,
          },
          eventType: reducerEventTypes[type],
          sideEffects: {
            do: [
              {
                type: isThunk ? type : doAct.type,
                payload: isThunk ? doAct.payload : doAct,
              },
            ],
            undo: [
              {
                type: undoAct.type,
                payload: isThunk ? undoAct.payload : undoAct,
              },
            ],
          },
        });
      } else {
        // ! Fix
        trrack.record({
          label,
          state: {
            type: 'stateLike',
            val: {
              type: 'checkpoint',
              val: api.getState(),
            } as any,
          },
          eventType: reducerEventTypes[type],
          sideEffects: {
            do: [],
            undo: [],
          },
        });
      }
    },
  });

  return { store, trrack, trrackStore };
}
