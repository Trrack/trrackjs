import { createAction, isAnyOf } from '@reduxjs/toolkit';

export const TRRACK_ACTIONS = {
  APPLY_STATE: 'trrack/apply_state',
};

export const trrackApply = createAction(
  TRRACK_ACTIONS.APPLY_STATE,
  function (payload) {
    return {
      payload,
    };
  }
);

export const isTrrackAction = isAnyOf(trrackApply);
