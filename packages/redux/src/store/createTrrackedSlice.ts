/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CaseReducerActions,
  createSlice,
  CreateSliceOptions,
  PayloadActionCreator,
  Slice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';

type Label = string;
export type LabelGenerator<Args = void> = (args: Args) => Label;

type LabelLike<CaseReducers extends SliceCaseReducers<any>> = Partial<{
  [K in keyof CaseReducerActions<CaseReducers>]: CaseReducerActions<CaseReducers>[K] extends PayloadActionCreator<
    infer P
  >
    ? Label | LabelGenerator<P>
    : never;
}>;

type LabelGenerators = { [key: string]: LabelGenerator<any> };

type EventMap<CaseReducers extends SliceCaseReducers<any>> = {
  [K in keyof CaseReducerActions<CaseReducers>]: string;
};

// Better type name?
// export type AlwaysDispatchReducers<
//   State,
//   CaseReducers extends SliceCaseReducers<any>
// > = Partial<{
//   [K in keyof CaseReducerActions<CaseReducers>]: CaseReducerActions<CaseReducers>[K] extends PayloadActionCreator<
//     infer P
//   >
//     ? Label | LabelGenerator<P>
//     : never;
// }>;

export type DoUndoActionCreators<S> = Partial<{
  [key: string]: (opts: { originalPayload: any; state: S }) => {
    do?: {
      type: string;
      payload: any;
    };
    undo: {
      type: string;
      payload: any;
    };
  };
}>;

export const LABELS = Symbol('label');
export const SIDEEFFECT_REDUCERS = Symbol('sideeffect-reducers');
export const TRRACKABLE = Symbol('trrackable');
export const EVENTS = Symbol('events');
export const GENERATED_EVENT_MAP = Symbol('generated-event-map');

export type TrrackableSlice<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
> = Slice<State, CaseReducers, Name> & {
  [LABELS]: LabelGenerators;
  [EVENTS]: EventMap<CaseReducers>;
  [TRRACKABLE]: boolean;
  [SIDEEFFECT_REDUCERS]: DoUndoActionCreators<State>;
  [GENERATED_EVENT_MAP]: { [key: string]: string };
};

export function createTrrackableSlice<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
>(
  options: CreateSliceOptions<State, CaseReducers, Name> & {
    labels?: LabelLike<CaseReducers>;
    eventTypes?: Partial<EventMap<CaseReducers>>;
    doUndoActionCreators?: DoUndoActionCreators<State>;
  }
): TrrackableSlice<State, CaseReducers, Name> {
  const slice = createSlice(options);

  const labels: LabelGenerators = {} as any;

  const eventMap: EventMap<CaseReducers> = {} as any;
  const suppliedEventMap = options.eventTypes;

  const sideEffectReducer: DoUndoActionCreators<State> = {};

  const generatedEventMap: { [key: string]: string } = {};

  Object.entries(slice.actions).forEach(
    ([key, action]: [string, PayloadActionCreator<any>]) => {
      // Label
      const suppliedLabelOrGenerator = ((options.labels as any) || {})[key];

      if (!suppliedLabelOrGenerator) {
        (labels as any)[action.type] = () => action.type;
      } else if (typeof suppliedLabelOrGenerator === 'string') {
        (labels as any)[action.type] = () => suppliedLabelOrGenerator;
      } else {
        (labels as any)[action.type] = suppliedLabelOrGenerator;
      }

      // Event
      if (!suppliedEventMap) {
        (eventMap as any)[key] = action.type;
      } else {
        const suppliedEventType = suppliedEventMap[key];
        if (!suppliedEventType) (eventMap as any)[key] = action.type;
        else (eventMap as any)[key] = suppliedEventType;
      }

      // SideEffect
      const sideEffect = (options.sideEffectReducers || {})[key];

      if (sideEffect) {
        sideEffectReducer[action.type] = sideEffect;
      }

      generatedEventMap[key] = action.type;
    }
  );

  return {
    ...slice,
    [LABELS]: labels,
    [EVENTS]: eventMap,
    [SIDEEFFECT_REDUCERS]: sideEffectReducer,
    [TRRACKABLE]: true,
    [GENERATED_EVENT_MAP]: generatedEventMap,
  };
}

export function isSliceTrrackable<S>(
  slice: Slice<S, any>
): slice is TrrackableSlice<S, any> {
  return (slice as any)[TRRACKABLE] ? true : false;
}
