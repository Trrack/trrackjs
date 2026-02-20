import { Slice } from '@reduxjs/toolkit';
import { TrrackableSlice } from './types';
export declare function isSliceTrrackable(slice: Slice): slice is TrrackableSlice<any, any>;
