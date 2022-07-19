import { GenericArgs } from '../../utils';
import { TrrackActionFunction } from '../action';

export type ActionParameterMap = Record<string, GenericArgs>;

export type ActionFunctionRegistry<
    T extends ActionParameterMap,
    DoKey extends Extract<keyof T, string> = Extract<keyof T, string>,
    DoArgs extends T[DoKey] = T[DoKey],
    UndoKey extends Extract<keyof T, string> = Extract<keyof T, string>,
    UndoArgs extends T[UndoKey] = T[UndoKey]
> = Record<DoKey, TrrackActionFunction<DoArgs, UndoKey, UndoArgs>>;

export type LabelGeneratorWithArgs<Args extends GenericArgs> = (
    ...args: Args
) => string;

export type LabelGenerator<Args extends GenericArgs> =
    | string
    | LabelGeneratorWithArgs<Args>;

export type LabelRegistry<
    T extends ActionParameterMap,
    DoKey extends Extract<keyof T, string> = Extract<keyof T, string>,
    DoArgs extends T[DoKey] = T[DoKey]
> = Record<DoKey, LabelGenerator<DoArgs>>;

export interface IActionRegistry<APM extends ActionParameterMap> {
    register<
        K extends Extract<keyof APM, string>,
        Action extends ActionFunctionRegistry<APM>[K]
    >(
        name: K,
        labelGenerator: LabelGenerator<Parameters<Action>>,
        action: Action
    ): IActionRegistry<APM>;

    registerUnchecked(
        name: string,
        labelGenerator: LabelGenerator<any>,
        action: TrrackActionFunction<any, any, any>
    ): IActionRegistry<APM>;
}
