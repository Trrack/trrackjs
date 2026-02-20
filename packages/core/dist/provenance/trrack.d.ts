import { Trrack } from './types';
import { ConfigureTrrackOptions } from './trrack-config-opts';
export declare function initializeTrrack<State = any, Event extends string = string>({ registry, initialState, }: ConfigureTrrackOptions<State, Event>): Trrack<State, Event>;
