import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { initializeTrrack, Registry } from '@trrack/core';
import { useEffect, useMemo, useState } from 'react';

function setup() {
    const registry = Registry.create<'count'>();
    const add = registry.register(
        'add',
        (state: { count: number }, amount: number) => {
            state.count += amount;
        },
        {
            eventType: 'count',
        }
    );

    const trrack = initializeTrrack({
        registry,
        initialState: { count: 0 },
    });

    return { trrack, add };
}

function BackendConsumer() {
    const { trrack, add } = useMemo(() => setup(), []);
    const [backend, setBackend] = useState(() => trrack.graph.backend);

    useEffect(() => {
        return trrack.currentChange(() => {
            setBackend(trrack.graph.backend);
        });
    }, [trrack]);

    return (
        <div>
            <button
                onClick={() => {
                    void trrack.apply('Add', add(1));
                }}
            >
                Add
            </button>
            <div data-testid="node-count">{Object.keys(backend.nodes).length}</div>
            <div data-testid="current-id">{backend.current}</div>
        </div>
    );
}

describe('React backend subscriptions', () => {
    it('rerenders when currentChange listeners set graph.backend into React state', async () => {
        render(<BackendConsumer />);

        const initialCurrentId = screen.getByTestId('current-id').textContent;
        expect(screen.getByTestId('node-count').textContent).toBe('1');

        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        await waitFor(() => {
            expect(screen.getByTestId('node-count').textContent).toBe('2');
        });

        expect(screen.getByTestId('current-id').textContent).not.toBe(
            initialCurrentId
        );
    });
});
