import { AnyAction, ConfigureStoreOptions, Slice } from '@reduxjs/toolkit';
export declare const trrackTraverseAction: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[state: unknown], unknown, "traverse", never, never>;
export declare function configureTrrackableStore<State>(opts: ConfigureStoreOptions<State, AnyAction> & {
    slices: Slice[];
}): {
    store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<State & {}, AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("@reduxjs/toolkit").ListenerMiddleware<unknown, import("@reduxjs/toolkit").ThunkDispatch<unknown, unknown, AnyAction>, unknown>, import("@reduxjs/toolkit").ThunkMiddleware<State, AnyAction, undefined>]> | import("redux").Middleware<{}, State, import("redux").Dispatch<AnyAction>>[]>;
    trrack: import("@trrack/core").Trrack<State & {}, string>;
    trrackStore: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
        current: import("@trrack/core").NodeId;
    }, AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<{
        current: import("@trrack/core").NodeId;
    }, AnyAction, undefined>]>;
};
