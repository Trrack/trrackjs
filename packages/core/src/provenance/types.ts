import { PayloadAction } from '@reduxjs/toolkit';
import { NodeId } from '@trrack/core';
import {
    CurrentChangeHandler,
    ProvenanceGraphStore,
    ProvenanceNode,
    RootNode,
    SideEffects,
    UnsubscribeCurrentChangeListener,
} from '../graph';
import { Registry } from '../registry';
import { TrrackEvents } from './trrack-events';

export type RecordActionArgs<State, Event extends string> = {
    label: string;
    state: State;
    eventType: Event;
    sideEffects: SideEffects;
    onlySideEffects?: boolean;
};

export interface Trrack<State, Event extends string> {
    registry: Registry<Event>;
    isTraversing: boolean;
    getState(node?: ProvenanceNode<State, Event>): State;
    graph: ProvenanceGraphStore;
    current: ProvenanceNode<State, Event>;
    root: RootNode<State>;
    record(args: RecordActionArgs<State, Event>): void;
    apply<T extends string, Payload = any>(
        label: string,
        act: PayloadAction<Payload, T>
    ): any;
    to(node: NodeId): Promise<void>;
    undo(): Promise<void>;
    redo(to?: 'latest' | 'oldest'): Promise<void>;
    currentChange(
        listener: CurrentChangeHandler,
        skipOnNew?: boolean
    ): UnsubscribeCurrentChangeListener;
    done(): void;
    tree(): any;
    on(event: TrrackEvents, listener: (args?: any) => void): void;
    export(): string;
    import(graphString: string): void;
}
