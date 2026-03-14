import { PayloadActionCreator } from '../action';
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
    register<DoActionType extends string, DoActionPayload = any, State = any>(type: DoActionType, actionFunction: StateChangeFunction<State, DoActionPayload>, config?: {
        eventType?: Event;
        label?: Label | LabelGenerator<DoActionPayload>;
    }): PayloadActionCreator<DoActionPayload, DoActionType>;
    register<DoActionType extends string, UndoActionType extends string, DoActionPayload = any, UndoActionPayload = any>(type: DoActionType, actionFunction: TrrackActionFunction<DoActionType, UndoActionType, UndoActionPayload, DoActionPayload>, config?: {
        eventType?: Event;
        label?: Label | LabelGenerator<DoActionPayload>;
    }): PayloadActionCreator<DoActionPayload, DoActionType>;
    get(type: string): TrrackActionRegisteredObject;
}
export {};
