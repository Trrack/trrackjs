import { AsyncThunk, CreateSliceOptions, SliceCaseReducers } from '@reduxjs/toolkit';
import { DoUndoActionCreators, LabelLike, ReducerEventTypes, TrrackableSlice } from './types';
export declare function createTrrackableSlice<State, CaseReducers extends SliceCaseReducers<State>, Event extends string = string, Name extends string = string>(options: CreateSliceOptions<State, CaseReducers, Name> & {
    labels?: LabelLike<CaseReducers>;
    reducerEventTypes?: Partial<ReducerEventTypes<Event, CaseReducers>>;
    doUndoActionCreators?: DoUndoActionCreators<CaseReducers>;
    asyncThunks?: Array<AsyncThunk<any, any, any>>;
}): TrrackableSlice<State, CaseReducers, Event, Name>;
