import { initializeTrrack } from '../src/provenance/trrack';
import { Registry } from '../src/registry';

function setup() {
    const registry = Registry.create<'count'>();

    const add = registry.register(
        'add',
        (state: { counter: number }, amount: number) => {
            state.counter += amount;
        },
        {
            eventType: 'count',
        }
    );

    const trrack = initializeTrrack({
        registry,
        initialState: {
            counter: 0,
        },
    });

    return { trrack, add };
}

describe('Traversal', () => {
    it('navigates branches with redo oldest/latest and direct traversal', async () => {
        const { trrack, add } = setup();

        await trrack.apply('Add 1', add(1));
        const branchPoint = trrack.current.id;

        await trrack.apply('Add 2', add(2));
        const oldestChild = trrack.current.id;
        expect(trrack.getState()).toEqual({ counter: 3 });

        await trrack.undo();
        expect(trrack.current.id).toBe(branchPoint);
        expect(trrack.getState()).toEqual({ counter: 1 });

        await trrack.apply('Add 5', add(5));
        const latestChild = trrack.current.id;
        expect(trrack.getState()).toEqual({ counter: 6 });

        await trrack.undo();
        expect(trrack.current.children).toEqual([oldestChild, latestChild]);

        await trrack.redo('oldest');
        expect(trrack.current.id).toBe(oldestChild);
        expect(trrack.getState()).toEqual({ counter: 3 });

        await trrack.undo();
        await trrack.redo('latest');
        expect(trrack.current.id).toBe(latestChild);
        expect(trrack.getState()).toEqual({ counter: 6 });

        await trrack.to(oldestChild);
        expect(trrack.current.id).toBe(oldestChild);
        expect(trrack.getState()).toEqual({ counter: 3 });
    });

    it('warns instead of throwing when undo/redo are unavailable', async () => {
        const { trrack, add } = setup();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await trrack.undo();
        expect(warn).toHaveBeenCalledWith('Already at root!');

        await trrack.apply('Add 1', add(1));
        await trrack.redo();
        expect(warn).toHaveBeenCalledWith('Already at latest in this branch!');

        warn.mockRestore();
    });

    it('replays undo and redo side effects when traversing between branches', async () => {
        const effects: string[] = [];
        const registry = Registry.create<'count' | 'effect'>();

        const add = registry.register(
            'add',
            (state: { counter: number }, amount: number) => {
                state.counter += amount;
            },
            {
                eventType: 'count',
            }
        );

        const external = registry.register(
            'external',
            (value: string) => {
                effects.push(`apply:${value}`);
                return {
                    do: { type: 'external/do', payload: value },
                    undo: { type: 'external/undo', payload: value },
                };
            },
            {
                eventType: 'effect',
            }
        );

        registry.register(
            'external/do',
            (value: string) => {
                effects.push(`do:${value}`);
                return {
                    undo: { type: 'noop', payload: value },
                };
            },
            {
                eventType: 'effect',
            }
        );

        registry.register(
            'external/undo',
            (value: string) => {
                effects.push(`undo:${value}`);
                return {
                    undo: { type: 'noop', payload: value },
                };
            },
            {
                eventType: 'effect',
            }
        );

        const trrack = initializeTrrack({
            registry,
            initialState: {
                counter: 0,
            },
        });

        await trrack.apply('Add 1', add(1));
        const branchPoint = trrack.current.id;

        await trrack.apply('External A', external('A'));
        const branchA = trrack.current.id;
        expect(effects).toEqual(['apply:A']);

        await trrack.undo();
        expect(trrack.current.id).toBe(branchPoint);
        expect(effects).toEqual(['apply:A', 'undo:A']);

        await trrack.apply('External B', external('B'));
        expect(effects).toEqual(['apply:A', 'undo:A', 'apply:B']);

        await trrack.to(branchA);
        expect(trrack.current.id).toBe(branchA);
        expect(trrack.getState()).toEqual({ counter: 1 });
        expect(effects).toEqual([
            'apply:A',
            'undo:A',
            'apply:B',
            'undo:B',
            'do:A',
        ]);
    });
});
