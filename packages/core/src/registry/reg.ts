/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction } from '@reduxjs/toolkit';
import produce, { enablePatches } from 'immer';

import {
    Label,
    LabelGenerator,
    ProduceWrappedStateChangeFunction,
    StateChangeFunction,
    TrrackActionConfig,
    TrrackActionFunction,
} from './action';

enablePatches();

/**
 * Represents a registered trrack action.
 */
type TrrackActionRegisteredObject = {
    func:
        | TrrackActionFunction<any, any, any, any>
        | ProduceWrappedStateChangeFunction<any>;
    config: TrrackActionConfig<any, any>;
};

/**
 * Prepares an action function for registration by wrapping it with the `produce` function if it has two arguments.
 * @param action - The action function to prepare.
 * @returns The prepared action function.
 */
function prepareAction(
    action:
        | TrrackActionFunction<any, any, any, any>
        | StateChangeFunction<any, any>
) {
    return action.length === 2
        ? (produce(action) as unknown as ProduceWrappedStateChangeFunction<any>)
        : (action as TrrackActionFunction<any, any, any, any>);
}

/**
 * Represents a registry for managing trrack actions.
 */
export class Registry<Event extends string> {
    /**
     * Creates a new instance of the `Registry` class.
     * @returns A new instance of the `Registry` class.
     */
    static create<Event extends string>(): Registry<Event> {
        return new Registry<Event>();
    }

    /**
     * The registry for storing TrrackActionRegisteredObject objects.
     */
    private registry: Map<string, TrrackActionRegisteredObject>;

    /**
     * Creates a new instance of the `Registry` class.
     */
    private constructor() {
        this.registry = new Map();
    }

    /**
     * Checks if an action with the specified name is registered in the registry.
     * @param name - The name of the action to check.
     * @returns `true` if the action is registered, `false` otherwise.
     */
    has(name: string) {
        return this.registry.has(name);
    }

    /**
     * Registers a new action in the registry.
     *
     * @template DoActionType - The type of the action to be registered.
     * @template UndoActionType - The type of the undo action associated with the registered action.
     * @template DoActionPayload - The payload type for the action.
     * @template UndoActionPayload - The payload type for the undo action.
     * @template State - The state type.
     *
     * @param {DoActionType} type - The type of the action.
     * @param {TrrackActionFunction<DoActionType, UndoActionType, UndoActionPayload, DoActionPayload>
     *  | StateChangeFunction<State, DoActionPayload>} actionFunction
     *  - The action function or state change function associated with the action.
     * @param {Object} [config] - Optional configuration for the action.
     * @param {Event} [config.eventType] - The event type associated with the action.
     * @param {Label | LabelGenerator<DoActionPayload>} [config.label] - The label or label generator for the action.
     *
     * @throws {Error} If the action function has more than two arguments.
     * @throws {Error} If the action is already registered.
     *
     * @returns {Action<DoActionPayload>} The created action.
     */
    register<
        DoActionType extends string,
        UndoActionType extends string,
        DoActionPayload = any,
        UndoActionPayload = any,
        State = any
    >(
        type: DoActionType,
        actionFunction:
            | TrrackActionFunction<
                  DoActionType,
                  UndoActionType,
                  UndoActionPayload,
                  DoActionPayload
              >
            | StateChangeFunction<State, DoActionPayload>,
        config?: {
            eventType: Event;
            label: Label | LabelGenerator<DoActionPayload>;
        }
    ) {
        const isState = actionFunction.length === 2;

        if (actionFunction.length > 2)
            throw new Error(
                'Incorrect action function signature. Action function can only have two arguments at most!'
            );

        if (this.has(type)) throw new Error(`Already registered: ${type}`);

        const { label = type, eventType = type as unknown as Event } =
            config || {};

        this.registry.set(type, {
            func: prepareAction(actionFunction),
            config: {
                hasSideEffects: !isState,
                label:
                    typeof label === 'string'
                        ? ((() => label) as LabelGenerator<void>)
                        : label,
                eventType,
            },
        });

        return createAction<DoActionPayload>(type);
    }

    /**
     * Gets the registered action with the specified type.
     * @param type - The type of the action to get.
     * @returns The registered action.
     * @throws An error if the action is not registered.
     */
    get(type: string) {
        const action = this.registry.get(type);

        if (!action) throw new Error(`Not registered: ${type}`);

        return action;
    }
}
