import { initializeTrrack, NodeId, Registry } from '@trrack/core';
import { ProvVis, ProvVisCreator } from '@trrack/vis-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Task = {
    id: string;
    title: string;
    completed: boolean;
};

type AppState = {
    tasks: Task[];
};

type AppEvent = 'add-task' | 'toggle-task' | 'remove-task';

const initialState: AppState = {
    tasks: [],
};

function createTask(title: string): Task {
    return {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        completed: false,
    };
}

function useVisDemo() {
    const [state, setState] = useState<AppState>(initialState);
    const [currentNodeId, setCurrentNodeId] = useState<string>('');
    const { registry, actions } = useMemo(() => {
        const reg = Registry.create<AppEvent>();

        const addTask = reg.register('add-task', (draft, task: Task) => {
            draft.tasks.push(task);
        });

        const toggleTask = reg.register(
            'toggle-task',
            (draft, taskId: string) => {
                const task = draft.tasks.find((item) => item.id === taskId);

                if (task) {
                    task.completed = !task.completed;
                }
            }
        );

        const removeTask = reg.register(
            'remove-task',
            (draft, taskId: string) => {
                draft.tasks = draft.tasks.filter((task) => task.id !== taskId);
            }
        );

        return {
            registry: reg,
            actions: {
                addTask,
                toggleTask,
                removeTask,
            },
        };
    }, []);

    const trrack = useMemo(() => {
        return initializeTrrack<AppState, AppEvent>({
            registry,
            initialState,
        });
    }, [registry]);

    useEffect(() => {
        const sync = () => {
            setState(trrack.current.state.val as AppState);
            setCurrentNodeId(trrack.current.id);
        };

        const unsubscribe = trrack.currentChange(sync);

        sync();

        if (Object.keys(trrack.graph.backend.nodes).length === 1) {
            void (async () => {
                const sketchTask = createTask('Sketch flow');
                const branchTask = createTask('Review branch handling');

                await trrack.apply(
                    'Add task: Sketch flow',
                    actions.addTask(sketchTask)
                );
                await trrack.apply(
                    'Add task: Review branch handling',
                    actions.addTask(branchTask)
                );
                await trrack.apply(
                    'Toggle task: Sketch flow',
                    actions.toggleTask(sketchTask.id)
                );
            })();
        }

        return () => {
            unsubscribe();
        };
    }, [trrack, actions]);

    const isAtRoot = currentNodeId === trrack.root.id;
    const isAtLatest = trrack.current.children.length === 0;

    return {
        actions,
        currentNodeId,
        isAtLatest,
        isAtRoot,
        state,
        trrack,
    };
}

function formatNodeLabel(label?: string) {
    return label || 'Root';
}

function App() {
    const { actions, currentNodeId, isAtLatest, isAtRoot, state, trrack } =
        useVisDemo();
    const [draftTask, setDraftTask] = useState('');
    const [showCreator, setShowCreator] = useState(true);
    const creatorHostRef = useRef<HTMLDivElement>(null);

    const visConfig = useMemo(
        () => ({
            changeCurrent: (id: NodeId) => trrack.to(id),
            nodeWidthShown: 4,
        }),
        [trrack]
    );

    const secondaryVisConfig = useMemo(
        () => ({
            ...visConfig,
            marginLeft: 36,
            marginTop: 36,
            nodeWidthShown: 3,
        }),
        [visConfig]
    );

    const creatorConfig = useMemo(
        () => ({
            changeCurrent: (id: NodeId) => trrack.to(id),
            marginLeft: 36,
            marginTop: 36,
            nodeWidthShown: 3,
        }),
        [trrack]
    );

    useEffect(() => {
        if (!showCreator || !creatorHostRef.current) {
            return undefined;
        }

        let dispose: (() => boolean) | undefined;
        let cancelled = false;

        void ProvVisCreator(creatorHostRef.current, trrack, creatorConfig).then(
            (cleanup) => {
                if (cancelled) {
                    cleanup();
                    return;
                }

                dispose = cleanup;
            }
        );

        return () => {
            cancelled = true;
            dispose?.();
        };
    }, [creatorConfig, showCreator, trrack]);

    const handleAddTask = () => {
        const title = draftTask.trim();

        if (!title) {
            return;
        }

        void trrack.apply(`Add task: ${title}`, actions.addTask(createTask(title)));
        setDraftTask('');
    };

    return (
        <main className="appShell">
            <section className="hero">
                <div>
                    <p className="eyebrow">Manual playground</p>
                    <h1>Trrack Vis Example</h1>
                    <p className="heroCopy">
                        Use this app to verify `ProvVis`, multiple simultaneous
                        visualizers, and `ProvVisCreator` mount cleanup against a
                        live Trrack instance.
                    </p>
                </div>
                <div className="heroStats">
                    <div className="statCard">
                        <span className="statLabel">Current node</span>
                        <strong>{formatNodeLabel(trrack.current.label)}</strong>
                    </div>
                    <div className="statCard">
                        <span className="statLabel">History nodes</span>
                        <strong>{Object.keys(trrack.graph.backend.nodes).length}</strong>
                    </div>
                    <div className="statCard">
                        <span className="statLabel">Visible tasks</span>
                        <strong>{state.tasks.length}</strong>
                    </div>
                </div>
            </section>

            <section className="workspace">
                <aside className="controlPanel">
                    <div className="panelHeader">
                        <h2>Actions</h2>
                        <p>
                            Branch by navigating to an earlier node in any graph
                            and adding or toggling a task from there.
                        </p>
                    </div>

                    <div className="actionGrid">
                        <button className="primaryButton" onClick={handleAddTask}>
                            Add task
                        </button>
                        <input
                            className="taskInput"
                            type="text"
                            value={draftTask}
                            placeholder="Describe a task"
                            onChange={(event) => setDraftTask(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleAddTask();
                                }
                            }}
                        />
                        <button
                            className="secondaryButton"
                            disabled={isAtRoot}
                            onClick={() => void trrack.undo()}
                        >
                            Undo
                        </button>
                        <button
                            className="secondaryButton"
                            disabled={isAtLatest}
                            onClick={() => void trrack.redo()}
                        >
                            Redo
                        </button>
                        <button
                            className="secondaryButton"
                            disabled={isAtRoot}
                            onClick={() => void trrack.to(trrack.root.id)}
                        >
                            Jump to root
                        </button>
                        <button
                            className="secondaryButton"
                            onClick={() => setShowCreator((current) => !current)}
                        >
                            {showCreator ? 'Unmount creator' : 'Mount creator'}
                        </button>
                    </div>

                    <div className="taskPanel">
                        <div className="panelHeader compact">
                            <h2>State snapshot</h2>
                            <p>Current node id: {currentNodeId}</p>
                        </div>
                        <ul className="taskList">
                            {state.tasks.map((task) => (
                                <li className="taskRow" key={task.id}>
                                    <div>
                                        <strong>{task.title}</strong>
                                        <span>
                                            {task.completed ? 'Completed' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="taskRowActions">
                                        <button
                                            className="chipButton"
                                            onClick={() =>
                                                void trrack.apply(
                                                    `${
                                                        task.completed
                                                            ? 'Reopen'
                                                            : 'Complete'
                                                    } task: ${task.title}`,
                                                    actions.toggleTask(task.id)
                                                )
                                            }
                                        >
                                            {task.completed ? 'Reopen' : 'Complete'}
                                        </button>
                                        <button
                                            className="chipButton danger"
                                            onClick={() =>
                                                void trrack.apply(
                                                    `Remove task: ${task.title}`,
                                                    actions.removeTask(task.id)
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {state.tasks.length === 0 ? (
                                <li className="emptyState">
                                    No tasks in this branch yet.
                                </li>
                            ) : null}
                        </ul>
                    </div>
                </aside>

                <section className="visualGrid">
                    <article className="vizPanel">
                        <div className="panelHeader compact">
                            <h2>Primary ProvVis</h2>
                            <p>Click nodes here to traverse and create branches.</p>
                        </div>
                        <div className="vizFrame light">
                            <ProvVis
                                root={trrack.root.id}
                                currentNode={trrack.current.id}
                                nodeMap={trrack.graph.backend.nodes}
                                config={visConfig}
                            />
                        </div>
                    </article>

                    <article className="vizPanel">
                        <div className="panelHeader compact">
                            <h2>Second instance</h2>
                            <p>
                                Mirrors the same Trrack graph to validate
                                multi-instance behavior.
                            </p>
                        </div>
                        <div className="vizFrame dark">
                            <ProvVis
                                root={trrack.root.id}
                                currentNode={trrack.current.id}
                                nodeMap={trrack.graph.backend.nodes}
                                config={secondaryVisConfig}
                            />
                        </div>
                    </article>

                    <article className="vizPanel creatorPanel">
                        <div className="panelHeader compact">
                            <h2>ProvVisCreator</h2>
                            <p>
                                Toggle mount state to confirm cleanup and
                                remount behavior.
                            </p>
                        </div>
                        <div className="vizFrame creatorSurface">
                            {showCreator ? (
                                <div className="creatorHost" ref={creatorHostRef} />
                            ) : (
                                <div className="emptyCreatorState">
                                    Creator container unmounted.
                                </div>
                            )}
                        </div>
                    </article>
                </section>
            </section>
        </main>
    );
}

export default App;
