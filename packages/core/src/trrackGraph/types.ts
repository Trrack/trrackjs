import {
    NodeId,
    Nodes,
    ProvenanceNode,
    RootNode,
    StateNode,
} from './components';

export type TrrackGraph<State, Event extends string> = {
    nodes: Nodes<State, Event>;
    current: NodeId;
    root: NodeId;
};

export type Trigger = 'traversal' | 'new';

export type CurrentChangeHandler = (trigger?: Trigger) => void;

export type CurrentChangeHandlerConfig = {
    skipOnNew: boolean;
};

export type UnsubscribeCurrentChangeListener = () => boolean;

export type TrrackGraphManager<State, Event extends string> = {
    initialState: State;
    backend: TrrackGraph<State, Event>;
    current: ProvenanceNode<State, Event>;
    root: RootNode<State>;
    currrentChangeHandler(
        fn: CurrentChangeHandler,
        config: CurrentChangeHandlerConfig
    ): UnsubscribeCurrentChangeListener;
    changeCurrent(id: NodeId): void;
    addNode(node: StateNode<State, Event>): void;
    addMetadata(id: NodeId, metadata: Record<string, unknown>): void;
    load(newGraph: TrrackGraph<State, Event>): TrrackGraph<State, Event>;
};

export type ListenerEntry = {
    id: string;
    fn: CurrentChangeHandler;
    config: CurrentChangeHandlerConfig;
};
