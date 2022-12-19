import { Registry } from '../registry/reg';

export type ConfigureTrrackOptions<S> = {
    registry: Registry<any>;
    initialState: S;
};
