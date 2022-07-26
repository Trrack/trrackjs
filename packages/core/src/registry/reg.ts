import { PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

import { TrrackActionFunction, TrrackActionMeta } from './action';

type TrrackActionConfig<
    DoActionName extends string,
    DoActionPayload,
    UndoActionType extends string,
    UndoActionPayload
> = {
    type: DoActionName;
    action: TrrackActionFunction<
        DoActionPayload,
        UndoActionType,
        UndoActionPayload
    >;
};

type TrrackActionCreator<P, T extends string> = (
    payload: P
) => PayloadAction<P, T, TrrackActionMeta>;

export function createActionCreator<
    DoActionName extends string = string,
    DoActionPayload = any
>(
    type: DoActionName,
    meta: TrrackActionMeta
): TrrackActionCreator<DoActionPayload, DoActionName> {
    return (payload: DoActionPayload) => ({
        type,
        payload,
        meta,
    });
}

export class Registry<T> {
    static create<T>(): Registry<T> {
        return new Registry<T>();
    }

    private registry: any;
    private registryState: any;

    private constructor() {
        this.registry = new Map();
        this.registryState = new Map();
    }

    private has(name: string) {
        return this.registry.has(name);
    }

    registerState<S, P = any>({
        type,
        action,
    }: {
        type: string;
        action: (state: S, payload: P) => void;
    }) {
        this.registryState.set(type, produce(action));

        return createActionCreator<string, P>(type, { hasSideEffects: false });
    }

    register<
        DoActionName extends string,
        DoActionPayload,
        UndoActionType extends string,
        UndoActionPayload
    >(
        act: TrrackActionConfig<
            DoActionName,
            DoActionPayload,
            UndoActionType,
            UndoActionPayload
        >
    ) {
        if (this.has(act.type))
            throw new Error(`Already registered: ${act.type}`);

        this.registry.set(act.type, act.action);

        return createActionCreator<DoActionName, DoActionPayload>(act.type, {
            hasSideEffects: true,
        });
    }

    getState(type: string) {
        const action = this.registryState.get(type);
        if (!action) throw new Error(`Not registered: ${type}`);
        return action;
    }

    get(type: string) {
        const action = this.registry.get(type);

        if (!action) throw new Error(`Not registered: ${type}`);

        return action;
    }
}
