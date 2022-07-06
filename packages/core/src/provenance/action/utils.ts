import { IActionRegistry } from '..';
import { ApplyActionObject, TrrackAction } from './types';

type RegistryType<T> = T extends IActionRegistry<infer R> ? R : never;

export class ActionUtils {
    private constructor() {
        throw new Error(
            'Do not create instance of ActionUtils. Use the static methods.'
        );
    }

    static apply<
        T extends IActionRegistry<any>,
        R extends RegistryType<T>,
        K extends keyof R
    >(
        registry: T,
        actionObject: ApplyActionObject<R[K], Parameters<R[K]>>
    ): TrrackAction<any, any, any, any> {
        const action = registry.get(actionObject.name);
        const result = action(...(actionObject.args as any));
        return {} as any;
    }
}
