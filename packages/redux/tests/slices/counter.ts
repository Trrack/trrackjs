import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { createTrrackableSlice } from '../../src';
import { SliceWrapper } from './utils';

export type CounterState = {
    value: number;
};

const initialState: CounterState = {
    value: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

const trrackableCounterSlice = createTrrackableSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

export const Counter: SliceWrapper<
    typeof counterSlice,
    typeof trrackableCounterSlice,
    CounterState
> = {
    slice: counterSlice,
    trrackableSlice: trrackableCounterSlice,
    generate() {
        return {
            value: -1,
        };
    },
    actions: trrackableCounterSlice.actions,
};
