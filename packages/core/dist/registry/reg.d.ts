import { Label, LabelGenerator, ProduceWrappedStateChangeFunction, StateChangeFunction, TrrackActionConfig, TrrackActionFunction } from './action';
type TrrackActionRegisteredObject = {
    func: TrrackActionFunction<any, any, any, any> | ProduceWrappedStateChangeFunction<any>;
    config: TrrackActionConfig<any, any>;
};
export declare class Registry<Event extends string> {
    static create<Event extends string>(): Registry<Event>;
    private registry;
    private constructor();
    has(name: string): boolean;
    register<DoActionType extends string, UndoActionType extends string, DoActionPayload = any, UndoActionPayload = any, State = any>(type: DoActionType, actionFunction: TrrackActionFunction<DoActionType, UndoActionType, UndoActionPayload, DoActionPayload> | StateChangeFunction<State, DoActionPayload>, config?: {
        eventType: Event;
        label: Label | LabelGenerator<DoActionPayload>;
    }): import("@reduxjs/toolkit/dist/tsHelpers").IsAny<DoActionPayload, import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, import("@reduxjs/toolkit/dist/tsHelpers").IsUnknown<DoActionPayload, import("@reduxjs/toolkit").ActionCreatorWithNonInferrablePayload<string>, import("@reduxjs/toolkit/dist/tsHelpers").IfVoid<DoActionPayload, import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, import("@reduxjs/toolkit/dist/tsHelpers").IfMaybeUndefined<DoActionPayload, import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<DoActionPayload, string>, import("@reduxjs/toolkit").ActionCreatorWithPayload<DoActionPayload, string>>>>>;
    get(type: string): TrrackActionRegisteredObject;
}
export {};
