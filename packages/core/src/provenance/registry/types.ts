import { TrrackActionFunction } from '../action';

export type ActionFunctionMap = Record<
    string,
    TrrackActionFunction<any, any, any>
>;
