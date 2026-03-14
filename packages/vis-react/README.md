# `@trrack/vis-react`

React components for rendering a Trrack provenance graph.

## Installation

```bash
yarn add @trrack/core @trrack/vis-react
```

## Usage

```tsx
import { initializeTrrack, Registry } from '@trrack/core';
import { ProvVis } from '@trrack/vis-react';

type Task = { id: string; complete: boolean };

const registry = Registry.create<'add-task'>();
const addTask = registry.register('add-task', (state, task: Task) => {
    state.tasks.push(task);
});

const trrack = initializeTrrack({
    registry,
    initialState: { tasks: [] as Task[] },
});

trrack.apply('Add task', addTask({ id: '1', complete: false }));

export function ProvenancePanel() {
    return (
        <ProvVis
            root={trrack.root.id}
            currentNode={trrack.current.id}
            nodeMap={trrack.graph.backend.nodes}
            config={{
                changeCurrent: (id) => trrack.to(id),
                annotateNode: (id, annotation) =>
                    trrack.annotations.add(annotation, id),
                getAnnotation: (id) => trrack.annotations.latest(id) || '',
                bookmarkNode: (id) => trrack.bookmarks.toggle(id),
                isBookmarked: (id) => trrack.bookmarks.is(id),
            }}
        />
    );
}
```

## Exports

- `ProvVis`
- `ProvVisCreator`
- `Tree`
- `defaultIcon`
- `defaultDarkmodeIcon`
- `type IconConfig`
- `type ProvVisConfig`
