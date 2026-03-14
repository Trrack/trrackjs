import { createAction } from '@trrack/core';
import { describe, expect, it, vi } from 'vitest';

import { initializeTrrack } from '../src/provenance/trrack';
import { Registry } from '../src/registry';

type CounterState = {
    counter: number;
};

type CounterEvent = 'add' | 'mark' | 'unmark';

function setupCounterTrrack(log: string[] = []) {
    const registry = Registry.create<CounterEvent>();

    const add = registry.register<'add', string, number, never, CounterState>(
        'add',
        (state: CounterState, amount: number) => {
            state.counter += amount;
            return state;
        }
    );

    const mark = registry.register('mark', (label: string) => {
        log.push(`do:${label}`);
        return {
            undo: createAction<string>('unmark')(label),
        };
    });

    registry.register('unmark', (label: string) => {
        log.push(`undo:${label}`);
        return {
            undo: createAction<string>('mark')(label),
        };
    });

    const trrack = initializeTrrack<CounterState, CounterEvent>({
        registry,
        initialState: {
            counter: 0,
        },
    });

    return { trrack, add, mark };
}

describe('@trrack/core bare-js integration', () => {
    it('supports branching traversal and redo selection', async () => {
        const { trrack, add } = setupCounterTrrack();

        await trrack.apply('Add 1', add(1));
        const oldestChild = trrack.current.id;

        await trrack.undo();
        await trrack.apply('Add 2', add(2));
        const newestChild = trrack.current.id;

        await trrack.to(trrack.root.id);
        await trrack.redo('oldest');
        expect(trrack.current.id).toBe(oldestChild);
        expect(trrack.getState()).toEqual({ counter: 1 });

        await trrack.to(trrack.root.id);
        await trrack.redo('latest');
        expect(trrack.current.id).toBe(newestChild);
        expect(trrack.getState()).toEqual({ counter: 2 });
    });

    it('notifies listeners for new nodes and traversals and supports unsubscribe', async () => {
        const { trrack, add } = setupCounterTrrack();
        const allEvents: string[] = [];
        const traversalOnlyEvents: string[] = [];

        const unsubscribeAll = trrack.currentChange((trigger) => {
            allEvents.push(trigger ?? 'none');
        });
        const unsubscribeTraversalOnly = trrack.currentChange((trigger) => {
            traversalOnlyEvents.push(trigger ?? 'none');
        }, true);

        await trrack.apply('Add 1', add(1));
        await trrack.apply('Add 2', add(2));
        await trrack.undo();

        expect(allEvents).toEqual(['new', 'new', 'traversal']);
        expect(traversalOnlyEvents).toEqual(['traversal']);

        expect(unsubscribeAll()).toBe(true);
        expect(unsubscribeTraversalOnly()).toBe(true);

        await trrack.apply('Add 3', add(3));

        expect(allEvents).toEqual(['new', 'new', 'traversal']);
        expect(traversalOnlyEvents).toEqual(['traversal']);
    });

    it('replays side effects in undo-then-do order when traversing between sibling branches', async () => {
        const log: string[] = [];
        const { trrack, mark } = setupCounterTrrack(log);

        await trrack.apply('Mark A', mark('A'));
        const markANode = trrack.current.id;
        await trrack.to(trrack.root.id);
        await trrack.apply('Mark B', mark('B'));

        log.length = 0;

        await trrack.to(markANode);

        expect(log).toEqual(['undo:B', 'do:A']);
    });

    it('warns instead of moving beyond the root or latest branch node', async () => {
        const { trrack, add } = setupCounterTrrack();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        await trrack.undo();
        await trrack.apply('Add 1', add(1));
        await trrack.redo();

        expect(warn).toHaveBeenCalledWith('Already at root!');
        expect(warn).toHaveBeenCalledWith('Already at latest in this branch!');

        warn.mockRestore();
    });
});
