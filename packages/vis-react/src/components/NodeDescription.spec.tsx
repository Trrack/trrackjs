import { render } from '@testing-library/react';
import { NodeId, StateNode } from '@trrack/core';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { ProvVisConfig } from './ProvVis';
import { NodeDescription } from './NodeDescription';

class ResizeObserverMock {
    observe() {
        return undefined;
    }

    disconnect() {
        return undefined;
    }
}

beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterAll(() => {
    vi.unstubAllGlobals();
});

type EventType = 'add';

type State = {
    count: number;
};

function createConfig(overrides: Partial<ProvVisConfig<State, EventType>> = {}) {
    return {
        animationDuration: 0,
        annotateNode: null,
        annotationHeight: 150,
        bookmarkNode: vi.fn(),
        changeCurrent: vi.fn(),
        getAnnotation: () => 'Saved note',
        gutter: 25,
        iconConfig: null,
        isBookmarked: () => true,
        isDarkMode: false,
        labelWidth: 150,
        marginLeft: 50,
        marginRight: 40,
        marginTop: 50,
        nodeAndLabelGap: 20,
        nodeExtra: {
            '*': <div data-testid="wildcard-extra">Wildcard extra</div>,
            add: <div data-testid="event-extra">Event extra</div>,
        },
        nodeWidthShown: 3,
        verticalSpace: 30,
        ...overrides,
    } satisfies ProvVisConfig<State, EventType>;
}

function createNode(): StateNode<State, EventType> {
    return {
        artifacts: [],
        children: [],
        createdOn: Date.now(),
        event: 'add',
        id: 'node-1' as NodeId,
        label: 'Add item',
        level: 1,
        meta: {
            annotation: [],
            bookmark: [],
        },
        parent: 'root' as NodeId,
        sideEffects: {
            do: [],
            undo: [],
        },
        state: {
            type: 'checkpoint',
            val: { count: 1 },
        },
    };
}

describe('NodeDescription', () => {
    it('shows event-specific extras before wildcard extras and keeps bookmarks visible for bookmarked nodes', () => {
        const view = render(
            <NodeDescription
                colorMap={{ Root: 'black', add: 'cornflowerblue' }}
                config={createConfig()}
                currentNode={'node-1' as NodeId}
                depth={1}
                extraHeight={0}
                isCurrent={true}
                isHover={false}
                node={createNode()}
                onClick={() => undefined}
                setExtraHeight={() => undefined}
                setHover={() => undefined}
                yOffset={0}
            />
        );

        expect(view.getByTestId('event-extra')).toBeTruthy();
        expect(view.queryByTestId('wildcard-extra')).toBeNull();
        expect(view.getByLabelText('Remove bookmark')).toBeTruthy();
        expect(view.getByText('Saved note')).toBeTruthy();
    });
});
