import { NodeId } from '@trrack/core';
type TrrackSliceState = {
    current: NodeId;
};
export declare const changeCurrent: import("@reduxjs/toolkit").ActionCreatorWithPayload<NodeId, "trrack/changeCurrent">;
export declare function getTrrackStore(init: TrrackSliceState): import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<TrrackSliceState, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<TrrackSliceState, import("redux").AnyAction, undefined>]>;
type TrrackStore = ReturnType<typeof getTrrackStore>;
export type TrrackStoreType = ReturnType<TrrackStore['getState']>;
export {};
