import { Slice } from '@reduxjs/toolkit';

import { TRRACKABLE, TrrackableSlice } from './types';

export function isSliceTrrackable(
  slice: Slice
): slice is TrrackableSlice<any, any> {
  return TRRACKABLE ? TRRACKABLE in slice : false;
}
