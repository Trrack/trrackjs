import { createAction } from '@reduxjs/toolkit';

import { Middlewares, PossibleMiddleware } from './types';

export function isMiddlewareArray<State>(
  middleware: PossibleMiddleware<State>
): middleware is Middlewares<State> {
  return Array.isArray(middleware);
}

export function asyncDoUndoActionCreatorHelper<T>(type: string, payload: T) {
  return createAction(type, function prepare(c: T) {
    return {
      payload: c,
    };
  })(payload);
}
