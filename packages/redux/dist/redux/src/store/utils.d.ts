import { Middlewares, PossibleMiddleware } from './types';
export declare function isMiddlewareArray<State>(middleware: PossibleMiddleware<State>): middleware is Middlewares<State>;
export declare function asyncDoUndoActionCreatorHelper<T>(type: string, payload: T): {
    payload: T;
    type: string;
};
