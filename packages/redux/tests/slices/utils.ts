import { Slice } from '@reduxjs/toolkit';
import { TrrackableSlice } from '../../src';

export type SliceWrapper<S extends Slice, TS extends TrrackableSlice, T> = {
    slice: S;
    trrackableSlice: TS;
    generate(args?: unknown): T;
    actions: S['actions'];
};
