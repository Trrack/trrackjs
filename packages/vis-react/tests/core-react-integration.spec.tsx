import { createAction } from '@reduxjs/toolkit';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { initializeTrrack, Registry, Trrack } from '@trrack/core';
import { useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

type CounterState = {
    count: number;
};

type CounterEvent = 'add';

function setupTrrack() {
    const registry = Registry.create<CounterEvent>();
    const add = registry.register<'add', string, number, never, CounterState>(
        'add',
        (state: CounterState, amount: number) => {
            state.count += amount;
            return state;
        }
    );

    const trrack = initializeTrrack<CounterState, CounterEvent>({
        registry,
        initialState: {
            count: 0,
        },
    });

    return { trrack, add };
}

function setupBranchingTrrack() {
    const { trrack, add } = setupTrrack();

    return { trrack, add };
}

function setupAsyncSideEffectTrrack(log: string[] = []) {
    const registry = Registry.create<'mark' | 'unmark'>();

    registry.register(
        'mark',
        (async (label: string) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 20);
            });
            log.push(`do:${label}`);

            return {
                undo: createAction<string>('unmark')(label),
            };
        }) as never
    );

    registry.register(
        'unmark',
        (async (label: string) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 20);
            });
            log.push(`undo:${label}`);

            return {
                undo: createAction<string>('mark')(label),
            };
        }) as never
    );

    const trrack = initializeTrrack<CounterState, 'mark' | 'unmark'>({
        registry,
        initialState: {
            count: 0,
        },
    });

    return { trrack };
}

type TrrackSetup = ReturnType<typeof setupTrrack>;

function CounterSubscriber<Event extends string>({
    name,
    onChange,
    trrack,
}: {
    name: string;
    onChange?: () => void;
    trrack: Trrack<CounterState, Event>;
}) {
    const [snapshot, setSnapshot] = useState(() => ({
        count: trrack.getState().count,
        currentNode: trrack.current.id,
    }));

    useEffect(() => {
        const unsubscribe = trrack.currentChange(() => {
            onChange?.();
            setSnapshot({
                count: trrack.getState().count,
                currentNode: trrack.current.id,
            });
        });

        return () => {
            unsubscribe();
        };
    }, [onChange, trrack]);

    return (
        <section>
            <span data-testid={`${name}-count`}>{snapshot.count}</span>
            <span data-testid={`${name}-current`}>{snapshot.currentNode}</span>
            <span data-testid={`${name}-parity`}>
                {snapshot.count % 2 === 0 ? 'even' : 'odd'}
            </span>
            <span data-testid={`${name}-position`}>
                {snapshot.currentNode === trrack.root.id ? 'root' : 'branch'}
            </span>
        </section>
    );
}

function Controls({
    add,
    trrack,
}: {
    add: TrrackSetup['add'];
    trrack: TrrackSetup['trrack'];
}) {
    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    void trrack.apply('Add', add(1));
                }}
            >
                Add
            </button>
            <button
                type="button"
                onClick={() => {
                    void trrack.undo();
                }}
            >
                Undo
            </button>
            <button
                type="button"
                onClick={() => {
                    void trrack.redo();
                }}
            >
                Redo
            </button>
        </div>
    );
}

describe('@trrack/core react integration', () => {
    it('keeps multiple subscribers in sync through applies, undo, and redo', async () => {
        const { trrack, add } = setupTrrack();
        const view = render(
            <>
                <CounterSubscriber name="left" trrack={trrack} />
                <CounterSubscriber name="right" trrack={trrack} />
                <Controls add={add} trrack={trrack} />
            </>
        );

        fireEvent.click(view.getByText('Add'));
        fireEvent.click(view.getByText('Add'));

        await waitFor(() => {
            expect(view.getByTestId('left-count').textContent).toBe('2');
            expect(view.getByTestId('right-count').textContent).toBe('2');
            expect(view.getByTestId('left-parity').textContent).toBe('even');
            expect(view.getByTestId('right-parity').textContent).toBe('even');
            expect(view.getByTestId('left-current').textContent).toBe(
                view.getByTestId('right-current').textContent
            );
        });

        fireEvent.click(view.getByText('Undo'));

        await waitFor(() => {
            expect(view.getByTestId('left-count').textContent).toBe('1');
            expect(view.getByTestId('right-count').textContent).toBe('1');
            expect(view.getByTestId('left-parity').textContent).toBe('odd');
        });

        fireEvent.click(view.getByText('Redo'));

        await waitFor(() => {
            expect(view.getByTestId('left-count').textContent).toBe('2');
            expect(view.getByTestId('right-count').textContent).toBe('2');
        });
    });

    it('cleans up subscriptions on unmount', async () => {
        const { trrack, add } = setupTrrack();
        const onChange = vi.fn();
        const view = render(<CounterSubscriber name="single" onChange={onChange} trrack={trrack} />);

        await act(async () => {
            await trrack.apply('Add', add(1));
        });

        expect(onChange).toHaveBeenCalledTimes(1);

        view.unmount();

        await act(async () => {
            await trrack.apply('Add', add(1));
        });

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('keeps branch indicators and counts in sync across subscribers during branch traversal', async () => {
        const { trrack, add } = setupBranchingTrrack();

        const view = render(
            <>
                <CounterSubscriber name="left" trrack={trrack} />
                <CounterSubscriber name="right" trrack={trrack} />
                <Controls add={add} trrack={trrack} />
            </>
        );

        await act(async () => {
            await trrack.apply('Add 1', add(1));
        });
        const firstBranchNode = trrack.current.id;

        await act(async () => {
            await trrack.undo();
            await trrack.apply('Add 2', add(2));
        });

        await waitFor(() => {
            expect(view.getByTestId('left-count').textContent).toBe('2');
            expect(view.getByTestId('right-count').textContent).toBe('2');
            expect(view.getByTestId('left-current').textContent).toBe(
                view.getByTestId('right-current').textContent
            );
        });

        await act(async () => {
            await trrack.to(firstBranchNode);
        });

        await waitFor(() => {
            expect(view.getByTestId('left-count').textContent).toBe('1');
            expect(view.getByTestId('right-count').textContent).toBe('1');
            expect(view.getByTestId('left-current').textContent).toBe(
                firstBranchNode
            );
            expect(view.getByTestId('right-current').textContent).toBe(
                firstBranchNode
            );
            expect(view.getByTestId('left-position').textContent).toBe('branch');
            expect(view.getByTestId('right-position').textContent).toBe('branch');
        });
    });

    it('waits for async traversal side effects before updating subscribers', async () => {
        vi.useFakeTimers();

        try {
            const log: string[] = [];
            const { trrack } = setupAsyncSideEffectTrrack(log);

            trrack.record({
                eventType: 'mark',
                label: 'Mark A',
                onlySideEffects: true,
                sideEffects: {
                    do: [createAction<string>('mark')('A')],
                    undo: [createAction<string>('unmark')('A')],
                },
                state: trrack.getState(),
            });
            const branchANode = trrack.current.id;

            await act(async () => {
                const undo = trrack.undo();
                await vi.advanceTimersByTimeAsync(20);
                await undo;
            });

            trrack.record({
                eventType: 'mark',
                label: 'Mark B',
                onlySideEffects: true,
                sideEffects: {
                    do: [createAction<string>('mark')('B')],
                    undo: [createAction<string>('unmark')('B')],
                },
                state: trrack.getState(),
            });
            log.length = 0;

            const view = render(
                <>
                    <CounterSubscriber name="left" trrack={trrack} />
                    <CounterSubscriber name="right" trrack={trrack} />
                </>
            );

            expect(view.getByTestId('left-current').textContent).toBe(
                trrack.current.id
            );
            expect(view.getByTestId('left-position').textContent).toBe('branch');

            const traversal = trrack.to(branchANode);
            await Promise.resolve();

            expect(view.getByTestId('left-current').textContent).not.toBe(
                branchANode
            );
            expect(view.getByTestId('right-current').textContent).not.toBe(
                branchANode
            );

            await act(async () => {
                await vi.advanceTimersByTimeAsync(40);
                await traversal;
            });

            await waitFor(() => {
                expect(view.getByTestId('left-current').textContent).toBe(
                    branchANode
                );
                expect(view.getByTestId('right-current').textContent).toBe(
                    branchANode
                );
                expect(view.getByTestId('left-position').textContent).toBe(
                    'branch'
                );
                expect(view.getByTestId('right-position').textContent).toBe(
                    'branch'
                );
            });
            expect(log).toEqual(['undo:B', 'do:A']);
        } finally {
            vi.useRealTimers();
        }
    });
});
