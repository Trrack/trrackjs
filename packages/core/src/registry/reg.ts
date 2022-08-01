/* eslint-disable @typescript-eslint/no-explicit-any */
import { enablePatches, produceWithPatches } from 'immer';

import {
    LabelGenerator,
    TrrackAction,
    TrrackActionFunction,
    TrrackActionFunctionObject,
} from './action';

enablePatches();

type TrrackActionCreator<P, T extends string> = (
    payload: P
) => TrrackAction<T, P>;

// ! Use redux create Action
export function createActionCreator<
    DoActionName extends string = string,
    DoActionPayload = any
>(type: DoActionName): TrrackActionCreator<DoActionPayload, DoActionName> {
    return (payload: DoActionPayload) => ({
        type,
        payload,
    });
}

function prepareAction(action: any) {
    return action.length === 2 ? produceWithPatches(action) : action;
}

export class Registry<Event extends string> {
    static create<Event extends string>(): Registry<Event> {
        return new Registry<Event>();
    }

    private registry: Map<string, TrrackActionFunctionObject>;

    private constructor() {
        this.registry = new Map();
    }

    private has(name: string) {
        return this.registry.has(name);
    }

    register(
        type: string,
        action: TrrackActionFunction,
        config?: {
            label?: string | LabelGenerator<Parameters<typeof action>>;
            eventType?: Event;
        }
    ) {
        if (action.length < 1 || action.length > 2)
            throw new Error('Incorrect action!');

        if (this.has(type)) throw new Error(`Already registered: ${type}`);

        const { label = type, eventType = type } = config || {};

        this.registry.set(type, {
            func: prepareAction(action),
            config: {
                hasSideEffects: action.length === 1,
                label:
                    typeof label === 'string'
                        ? ((() => label) as LabelGenerator<
                              Parameters<typeof action>
                          >)
                        : label,
                eventType,
            },
        });

        return createActionCreator<typeof type>(type);
    }

    get(type: string) {
        const action = this.registry.get(type);

        if (!action) throw new Error(`Not registered: ${type}`);

        return action;
    }
}
