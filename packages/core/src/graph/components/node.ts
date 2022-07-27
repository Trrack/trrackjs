import { Patch } from 'immer';

import { TrrackAction } from '../../registry';
import { FlavoredId, ID } from '../../utils';

export type NodeId = FlavoredId<string, 'Node'>;

type Checkpoint<S> = {
    type: 'checkpoint';
    val: S;
};

type Patches = {
    type: 'patch';
    checkpointRef: NodeId;
    val: Array<Patch>;
};

type StateLike<S> = Checkpoint<S> | Patches;

type BaseNode<S> = {
    id: NodeId;
    createdOn: number;
    children: NodeId[];
    state: StateLike<S>;
    level: number;
};

export type RootNode<S> = BaseNode<S> & {
    label: string;
};

export type SideEffects = {
    do: Array<TrrackAction<any, any>>;
    undo: Array<TrrackAction<any, any>>;
};

export type StateNode<S> = RootNode<S> & {
    parent: NodeId;
    sideEffects: SideEffects;
};

export type ProvenanceNode<S> = RootNode<S> | StateNode<S>;

export type Nodes<S> = Record<string, ProvenanceNode<S>>;

export function isStateNode<S>(node: ProvenanceNode<S>): node is StateNode<S> {
    return 'parent' in node;
}

export function isRootNode<S>(node: ProvenanceNode<S>): node is RootNode<S> {
    return !isStateNode(node);
}

export function createStateNode<S>({
    parent,
    state,
    label,
    sideEffects = {
        do: [],
        undo: [],
    },
}: {
    parent: ProvenanceNode<S>;
    state: S;
    label: string;
    sideEffects?: SideEffects;
}): StateNode<S> {
    return {
        id: ID.get(),
        label,
        children: [],
        parent: parent.id,
        createdOn: Date.now(),
        sideEffects,
        state: {
            type: 'checkpoint',
            val: state,
        },
        level: parent.level + 1,
    };
}
