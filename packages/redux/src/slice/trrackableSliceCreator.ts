import {
  AsyncThunk,
  CaseReducerActions,
  createSlice,
  CreateSliceOptions,
  PayloadAction,
  PayloadActionCreator,
  Slice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';

import {
  ACTION_NAME_TYPE_MAP,
  ActionNameToTypeMap,
  ASYNC_THUNKS,
  DO_UNDO_ACTION_CREATORS,
  DoUndoActionCreators,
  EVENTS,
  GeneratedDoUndoActionCreators,
  LabelGenerators,
  LabelLike,
  LABELS,
  NO_OP_ACTION,
  ReducerEventTypes,
  TRRACKABLE,
  TrrackableSlice,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
function createNameToTypeMap<
  CaseReducers extends SliceCaseReducers<any>,
  S extends Slice<any, CaseReducers, any>
>(slice: S) {
  const actionNameToType = {} as ActionNameToTypeMap<CaseReducers>;

  Object.entries(slice.actions).forEach(
    ([key, action]: [
      keyof CaseReducerActions<CaseReducers>,
      PayloadActionCreator<any>
    ]) => {
      actionNameToType[key] =
        action.type as ActionNameToTypeMap<CaseReducers>[typeof key];
    }
  );

  return actionNameToType;
}

function normalizeLabelGenerators<
  CaseReducers extends SliceCaseReducers<any>,
  S extends Slice<any, CaseReducers, any>
>(
  slice: S,
  suppliedLabelLikes: LabelLike<CaseReducers>,
  thunks: Array<AsyncThunk<any, any, any>>
): LabelGenerators {
  const labelGenerators: LabelGenerators = {};

  thunks.forEach((thunk) => {
    const key = thunk.typePrefix;
    const suppliedLabelLike = suppliedLabelLikes[key];

    if (!suppliedLabelLike) {
      labelGenerators[key] = () => key;
      return;
    }

    if (typeof suppliedLabelLike === 'string') {
      labelGenerators[key] = () => suppliedLabelLike;
      return;
    }

    if (typeof suppliedLabelLike === 'function') {
      labelGenerators[key] = suppliedLabelLike;
      return;
    }

    throw new Error(`Error creating label generator for ${key.toString()}`);
  });

  Object.entries(slice.actions).forEach(
    ([key, action]: [
      keyof CaseReducerActions<CaseReducers>,
      PayloadActionCreator<any>
    ]) => {
      const suppliedLabelLike = suppliedLabelLikes[key];

      if (!suppliedLabelLike) {
        labelGenerators[action.type] = () => action.type;
        return;
      }

      if (typeof suppliedLabelLike === 'string') {
        labelGenerators[action.type] = () => suppliedLabelLike;
        return;
      }

      if (typeof suppliedLabelLike === 'function') {
        labelGenerators[action.type] = suppliedLabelLike;
        return;
      }

      throw new Error(
        `Error creating label generator for ${key.toString()}: ${action.type}`
      );
    }
  );

  return labelGenerators;
}

function createReducerEventTypes<
  Event extends string,
  CaseReducers extends SliceCaseReducers<any>,
  S extends Slice<any, CaseReducers, any>
>(
  slice: S,
  suppliedEventTypes: Partial<ReducerEventTypes<Event, CaseReducers>>,
  thunks: Array<AsyncThunk<any, any, any>>
): ReducerEventTypes<Event, CaseReducers> {
  const reducerEventTypes: any = {};

  thunks.forEach((thunk) => {
    const key = thunk.typePrefix;
    const suppliedEventType = suppliedEventTypes[key];

    if (!suppliedEventType) reducerEventTypes[key] = key;
    else reducerEventTypes[key] = suppliedEventType;
  });

  Object.entries(slice.actions).forEach(
    ([key, action]: [
      keyof CaseReducerActions<CaseReducers>,
      PayloadActionCreator<any>
    ]) => {
      const suppliedEventType = suppliedEventTypes[key];

      if (!suppliedEventType) reducerEventTypes[action.type] = action.type;
      else reducerEventTypes[action.type] = suppliedEventType;
    }
  );

  return reducerEventTypes as ReducerEventTypes<Event, CaseReducers>;
}

function createDoUndoActionCreators<
  State,
  CaseReducers extends SliceCaseReducers<any>
>(
  slice: Slice<State, CaseReducers, any>,
  suppliedDoUndoActionCreators: DoUndoActionCreators<CaseReducers>,
  thunks: Array<AsyncThunk<any, any, any>>
): GeneratedDoUndoActionCreators {
  const duac: GeneratedDoUndoActionCreators = {};

  thunks.forEach((thunk) => {
    const key = thunk.typePrefix;

    const suppliedDoUndoActionCreator =
      suppliedDoUndoActionCreators[key as string];
    if (!suppliedDoUndoActionCreator) {
      duac[key] = () => {
        return {
          do: NO_OP_ACTION(),
          undo: NO_OP_ACTION(),
        };
      };
    } else {
      duac[key] = (args: {
        action: PayloadAction;
        previousState: State;
        currentState: State;
      }) => {
        const { do: doAct, undo } = suppliedDoUndoActionCreator(args);

        return {
          do: doAct ? doAct : NO_OP_ACTION(),
          undo,
        };
      };
    }
  });

  Object.entries(slice.actions).forEach(
    <K extends keyof CaseReducerActions<CaseReducers>>([key, action]: [
      K,
      Exclude<CaseReducerActions<CaseReducers>[K], void>
    ]) => {
      const suppliedDoUndoActionCreator =
        suppliedDoUndoActionCreators[key as string];
      if (!suppliedDoUndoActionCreator) {
        duac[action.type] = () => {
          return {
            do: NO_OP_ACTION(),
            undo: NO_OP_ACTION(),
          };
        };
      } else {
        duac[action.type] = (args: {
          action: PayloadAction;
          previousState: State;
          currentState: State;
        }) => {
          const { do: doAct, undo } = suppliedDoUndoActionCreator(args);

          return {
            do: doAct ? doAct : NO_OP_ACTION(),
            undo,
          };
        };
      }
    }
  );

  return duac;
}

export function createTrrackableSlice<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Event extends string = string,
  Name extends string = string
>(
  options: CreateSliceOptions<State, CaseReducers, Name> & {
    labels?: LabelLike<CaseReducers>;
    reducerEventTypes?: Partial<ReducerEventTypes<Event, CaseReducers>>;
    doUndoActionCreators?: DoUndoActionCreators<CaseReducers>;
    asyncThunks?: Array<AsyncThunk<any, any, any>>;
  }
): TrrackableSlice<State, CaseReducers, Event, Name> {
  const slice = createSlice(options);

  const actionNameToType: ActionNameToTypeMap<CaseReducers> =
    createNameToTypeMap(slice);

  const labels = normalizeLabelGenerators(
    slice,
    options.labels || {},
    options.asyncThunks || []
  );

  const reducerEventTypes = createReducerEventTypes(
    slice,
    options.reducerEventTypes || {},
    options.asyncThunks || []
  );

  const doUndoActioncreators = createDoUndoActionCreators(
    slice,
    options.doUndoActionCreators || {},
    options.asyncThunks || []
  );

  return {
    ...slice,
    [LABELS]: labels,
    [EVENTS]: reducerEventTypes,
    [DO_UNDO_ACTION_CREATORS]: doUndoActioncreators,
    [TRRACKABLE]: true,
    [ACTION_NAME_TYPE_MAP]: actionNameToType,
    [ASYNC_THUNKS]: options.asyncThunks || [],
  };
}
