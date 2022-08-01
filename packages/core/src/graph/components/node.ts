/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patch } from 'immer';

import { TrrackAction } from '../../registry';
import { FlavoredId, ID } from '../../utils';

export type NodeId = FlavoredId<string, 'Node'>;

type Checkpoint<State> = {
    type: 'checkpoint';
    val: State;
};

type Patches = {
    type: 'patch';
    checkpointRef: NodeId;
    val: Array<Patch>;
};

export type StateLike<State> = Checkpoint<State> | Patches;

/**
 * Artifact Types
 */
export type ArtifactId = FlavoredId<string, 'Artifact'>;

export type BaseArtifactType<A> = {
    id: ArtifactId;
    createdOn: number;
    val: A;
};

/**
 * Node Metadata Type
 */
type NodeMetadata<Event extends string = any> = {
    createdOn: number;
    eventType: Event | 'Root';
    [key: string]: any;
};

/**
 * Node Types
 */
type BaseNode<State, Event extends string> = {
    id: NodeId;
    meta: NodeMetadata<Event>;
    children: NodeId[];
    state: StateLike<State>;
    level: number;
};

export type RootNode<
    State = any,
    Event extends string = any,
    Artifact extends BaseArtifactType<any> = any
> = BaseNode<State, Event> & {
    label: string;
    artifact?: Artifact;
};

export type SideEffects = {
    do: Array<TrrackAction<any, any>>;
    undo: Array<TrrackAction<any, any>>;
};

export type StateNode<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
> = RootNode<State, Event, Artifact> & {
    parent: NodeId;
    sideEffects: SideEffects;
};

export type ProvenanceNode<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
> = RootNode<State, Event, Artifact> | StateNode<State, Event, Artifact>;

export type Nodes<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
> = Record<string, ProvenanceNode<State, Event, Artifact>>;

export function isStateNode<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
>(
    node: ProvenanceNode<State, Event, Artifact>
): node is StateNode<State, Event, Artifact> {
    return 'parent' in node;
}

export function isRootNode<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
>(
    node: ProvenanceNode<State, Event, Artifact>
): node is RootNode<State, Event, Artifact> {
    return !isStateNode(node);
}

export function createRootNode<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
>(args: {
    state: State;
    artifact?: Artifact;
    label?: string;
}): RootNode<State, Event, Artifact> {
    const { label = undefined, state, artifact } = args;

    return {
        id: ID.get(),
        label: label || 'Root',
        children: [],
        level: 0,
        meta: {
            createdOn: Date.now(),
            eventType: 'Root',
        },
        state: {
            type: 'checkpoint',
            val: state,
        },
        artifact,
    };
}

export function createStateNode<
    State,
    Event extends string,
    Artifact extends BaseArtifactType<any>
>({
    parent,
    state,
    label,
    sideEffects = {
        do: [],
        undo: [],
    },
    artifact = undefined,
    eventType,
}: {
    parent: ProvenanceNode<State, Event, Artifact>;
    state: StateLike<State>;
    label: string;
    sideEffects?: SideEffects;
    artifact?: Artifact;
    eventType: Event;
}): StateNode<State, Event, Artifact> {
    return {
        id: ID.get(),
        label,
        children: [],
        parent: parent.id,
        meta: {
            createdOn: Date.now(),
            eventType: eventType,
        },
        sideEffects,
        state,
        level: parent.level + 1,
        artifact,
    };
}
