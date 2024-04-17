import { Registry } from '../registry/reg';

export type ConfigureTrrackOptions<S, E extends string = string> = {
    registry: Registry<E>;
    initialState: S;
};
