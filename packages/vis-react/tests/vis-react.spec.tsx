import { act, render } from '@testing-library/react';
import { initializeTrrack, Registry } from '@trrack/core';

import { ProvVis, ProvVisCreator } from '../src';

type Task = {
    id: string;
    complete: boolean;
};

type AppState = {
    tasks: Task[];
};

type AppEvent = 'add-task';

class ResizeObserverMock {
    observe() {
        return undefined;
    }

    unobserve() {
        return undefined;
    }

    disconnect() {
        return undefined;
    }
}

beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })));
    Element.prototype.scrollTo = vi.fn();
});

afterAll(() => {
    vi.unstubAllGlobals();
});

function setupTrrack() {
    const registry = Registry.create<AppEvent>();
    const addTask = registry.register('add-task', (state, task: Task) => {
        state.tasks.push(task);
    });

    const trrack = initializeTrrack<AppState, AppEvent>({
        registry,
        initialState: {
            tasks: [],
        },
    });

    return { trrack, addTask };
}

describe('@trrack/vis-react', () => {
    it('renders a provenance graph from a Trrack instance', async () => {
        const { trrack, addTask } = setupTrrack();

        await act(async () => {
            trrack.apply('Add task 1', addTask({ id: '1', complete: false }));
        });

        const view = render(
            <ProvVis
                root={trrack.root.id}
                currentNode={trrack.current.id}
                nodeMap={trrack.graph.backend.nodes}
                config={{
                    changeCurrent: (id) => trrack.to(id),
                }}
            />
        );

        expect(view.container.querySelectorAll('.provenance-node').length).toBe(
            2
        );
        expect(view.getByText('Add task 1')).toBeTruthy();
    });

    it('rerenders when ProvVisCreator observes current-node changes', async () => {
        const { trrack, addTask } = setupTrrack();
        const element = document.createElement('div');

        await act(async () => {
            await ProvVisCreator(element, trrack);
        });

        expect(element.querySelectorAll('.provenance-node').length).toBe(1);

        await act(async () => {
            trrack.apply('Add task 2', addTask({ id: '2', complete: false }));
            await Promise.resolve();
        });

        expect(element.textContent).toContain('Add task 2');
        expect(element.querySelectorAll('.provenance-node').length).toBe(2);
    });
});
