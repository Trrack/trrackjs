import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { initializeTrrack, Registry } from '@trrack/core';
import { useState } from 'react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

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

function getRenderedNode(container: HTMLElement, nodeId: string) {
    const node = container.querySelector(
        `.provenance-node[data-node-id="${nodeId}"]`
    );

    if (!node) {
        throw new Error(`Could not find rendered node ${nodeId}`);
    }

    return node as HTMLElement;
}

function getNodeDescription(container: HTMLElement, nodeId: string) {
    const description = container.querySelector(
        `.node-description[data-node-id="${nodeId}"]`
    );

    if (!description) {
        throw new Error(`Could not find node description ${nodeId}`);
    }

    return description as HTMLElement;
}

function InteractiveProvVis({
    trrack,
}: {
    trrack: ReturnType<typeof initializeTrrack<AppState, AppEvent>>;
}) {
    const [currentNode, setCurrentNode] = useState(trrack.current.id);
    const [annotations, setAnnotations] = useState<Record<string, string>>({});
    const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

    return (
        <ProvVis
            root={trrack.root.id}
            currentNode={currentNode}
            nodeMap={trrack.graph.backend.nodes}
            config={{
                annotateNode: (id, annotation) =>
                    setAnnotations((previous) => ({
                        ...previous,
                        [id]: annotation,
                    })),
                bookmarkNode: (id) =>
                    setBookmarks((previous) => ({
                        ...previous,
                        [id]: !previous[id],
                    })),
                changeCurrent: setCurrentNode,
                getAnnotation: (id) => annotations[id] ?? '',
                isBookmarked: (id) => Boolean(bookmarks[id]),
                nodeExtra: {
                    '*': <div data-testid="node-extra">Current node details</div>,
                },
            }}
        />
    );
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

    it('calls changeCurrent when a rendered node is clicked', async () => {
        const { trrack, addTask } = setupTrrack();

        trrack.apply('Add task 1', addTask({ id: '1', complete: false }));
        const firstTaskNodeId = trrack.current.id;
        trrack.apply('Add task 2', addTask({ id: '2', complete: false }));

        const changeCurrent = vi.fn();
        const view = render(
            <ProvVis
                root={trrack.root.id}
                currentNode={trrack.current.id}
                nodeMap={trrack.graph.backend.nodes}
                config={{ changeCurrent }}
            />
        );

        fireEvent.click(getRenderedNode(view.container, firstTaskNodeId));

        expect(changeCurrent).toHaveBeenCalledWith(firstTaskNodeId);
    });

    it('supports bookmarking, annotation, and current-node extras', async () => {
        const { trrack, addTask } = setupTrrack();

        trrack.apply('Add task 1', addTask({ id: '1', complete: false }));
        const firstTaskNodeId = trrack.current.id;

        const view = render(<InteractiveProvVis trrack={trrack} />);

        expect(
            getNodeDescription(view.container, firstTaskNodeId).querySelector(
                '[data-testid="node-extra"]'
            )
        ).toBeTruthy();

        fireEvent.mouseEnter(getNodeDescription(view.container, firstTaskNodeId));
        fireEvent.click(view.getByLabelText('Add bookmark'));
        expect(view.getByLabelText('Remove bookmark')).toBeTruthy();

        fireEvent.click(view.getByLabelText('Edit annotation'));
        fireEvent.change(view.getByLabelText('Annotation'), {
            target: { value: 'Needs review' },
        });
        fireEvent.click(view.getByText('Save'));

        expect(view.getByText('Needs review')).toBeTruthy();

        fireEvent.click(getRenderedNode(view.container, trrack.root.id));

        await waitFor(() => {
            expect(
                getNodeDescription(view.container, trrack.root.id).querySelector(
                    '[data-testid="node-extra"]'
                )
            ).toBeTruthy();
        });
    });
});
