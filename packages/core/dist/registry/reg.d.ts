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
    }): import("../action").PayloadActionCreator<DoActionPayload, string>;
    get(type: string): TrrackActionRegisteredObject;
}
export {};
