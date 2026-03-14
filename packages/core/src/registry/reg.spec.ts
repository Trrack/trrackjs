import { createAction } from '@trrack/core';
import { describe, expect, it } from 'vitest';

import { Registry } from './reg';

describe('Registry', () => {
    it('registers state actions with generated labels and event types', () => {
        const registry = Registry.create<'math'>();

        const add = registry.register<'add', string, number, never, { count: number }>(
            'add',
            (state: { count: number }, amount: number) => {
                state.count += amount;
                return state;
            },
            {
                eventType: 'math',
                label: (amount) => `Add ${amount}`,
            }
        );

        const action = registry.get(add(2).type);
        const nextState = action.func({ count: 1 }, 2) as { count: number };

        expect(action.config.hasSideEffects).toBe(false);
        expect(action.config.eventType).toBe('math');
        expect(action.config.label(2)).toBe('Add 2');
        expect(nextState).toEqual({ count: 3 });
    });

    it('registers side-effect actions and marks them accordingly', () => {
        const registry = Registry.create<'history'>();

        registry.register(
            'log-do',
            (label: string) => ({
                undo: createAction<string>('log-undo')(label),
            }),
            {
                eventType: 'history',
                label: 'log-do',
            }
        );
        registry.register(
            'log-undo',
            (label: string) => ({
                undo: createAction<string>('log-do')(label),
            }),
            {
                eventType: 'history',
                label: 'log-undo',
            }
        );

        expect(registry.get('log-do').config.hasSideEffects).toBe(true);
        expect(registry.get('log-undo').config.hasSideEffects).toBe(true);
    });

    it('throws for duplicate registrations, invalid signatures, and missing actions', () => {
        const registry = Registry.create<'math'>();

        registry.register<'add', string, number, never, { count: number }>(
            'add',
            (state: { count: number }, amount: number) => {
                state.count += amount;
                return state;
            }
        );

        expect(() =>
            registry.register<'add', string, number, never, { count: number }>(
                'add',
                (state: { count: number }, amount: number) => {
                    state.count += amount;
                    return state;
                }
            )
        ).toThrow('Already registered: add');

        expect(() =>
            registry.register(
                'too-many-args',
                ((a: unknown, b: unknown, c: unknown) => ({ a, b, c })) as never
            )
        ).toThrow('Incorrect action function signature');

        expect(() => registry.get('missing')).toThrow('Not registered: missing');
    });
});
