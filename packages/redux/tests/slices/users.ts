import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTrrackableSlice } from '../../src';
import { SliceWrapper } from './utils';

export type SingleUser = {
    id: string;
    name: string;
};

export type Users = SingleUser[];

const initialState: Users = [];

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<SingleUser>) {
            state.push(action.payload);
        },
    },
});

const trrackableUsersSlice = createTrrackableSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<SingleUser>) {
            state.push(action.payload);
        },
    },
    labels: {
        addUser: 'custom-adder-label',
    },
    reducerEventTypes: {
        addUser: 'add-user-event',
    },
});

export const User: SliceWrapper<
    typeof usersSlice,
    typeof trrackableUsersSlice,
    SingleUser
> = {
    slice: usersSlice,
    trrackableSlice: trrackableUsersSlice,
    generate() {
        return {
            id: Math.random().toString(),
            name: `User ${Math.floor(Math.random() * 1000)}`,
        };
    },
    actions: trrackableUsersSlice.actions,
};
