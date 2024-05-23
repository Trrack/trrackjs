import { PayloadAction } from '@reduxjs/toolkit';
import { NodeId } from '../graph/components/node';
import {
    Artifact,
    CurrentChangeHandler,
    Metadata,
    ProvenanceGraphStore,
    ProvenanceNode,
    RootNode,
    SideEffects,
    UnsubscribeCurrentChangeListener,
} from '../graph';
import { ProvenanceGraph } from '../graph/graph-slice';
import { Registry } from '../registry';
import { TrrackEvents } from './trrack-events';

export type RecordActionArgs<State, Event extends string> = {
    label: string;
    state: State;
    eventType: Event;
    sideEffects: SideEffects;
    onlySideEffects?: boolean;
};

export interface ScreenshotStream {
    /**
     * Presents a dialog to the user to record the current tab, begins a video stream,
     * and enables the capture of screenshots.
     */
    start(): void;
    /**
     * Immediately captures a screenshot from the video stream.
     * @returns The captured screenshot.
     */
    capture(): ImageData;
    /**
     * Captures a screenshot after a delay.
     * @param timeout - The amount of time to delay the capture in ms.
     */
    delayCapture(timeout: number): void;
    /**
     * Stops the video stream and screenshot capture.
     */
    stop(): void;
    /**
     * Returns the nth most recent screenshot in the array of stored screenshots.
     * @param n - The index of the screenshot to retrieve. 0 is the most recent.
     * @returns The nth screenshot.
     */
    getNth(n: number): ImageData | null;
    /**
     * Returns the number of stored screenshots.
     */
    count(): number;
    /**
     * Returns a copy of the array of stored screenshots.
     */
    getAll(): ImageData[];
    /**
     * @returns whether capturing is allowed. Generally is false before start() is called and after stop() is called.
     */
    canCapture(): boolean;
    /**
     * Registers a listener to be called when a screenshot is captured.
     * @param listener - The listener to register.
     * @returns A function to unregister the listener.
     */
    registerScreenshotListener(
        listener: (image: ImageData) => void
    ): () => void;
}

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
    metadata: {
        add(metadata: Record<string, unknown>, node?: NodeId): void;
        latestOfType<T = unknown>(
            type: string,
            node?: NodeId
        ): Metadata<T> | undefined;
        allOfType<T = unknown>(
            type: string,
            node?: NodeId
        ): Metadata<T>[] | undefined;
        latest(node?: NodeId): Record<string, Metadata> | undefined;
        all(node?: NodeId): Record<string, Metadata[]> | undefined;
        types(node?: NodeId): string[];
    };
    artifact: {
        add<A>(artifact: A, node?: NodeId): void;
        latest(node?: NodeId): Artifact | undefined;
        all(node?: NodeId): Artifact[] | undefined;
    };
    annotations: {
        add(annotation: string, node?: NodeId): void;
        latest(node?: NodeId): string | undefined;
        all(node?: NodeId): string[] | undefined;
    };
    bookmarks: {
        add(node?: NodeId): void;
        remove(node?: NodeId): void;
        is(node?: NodeId): boolean;
        toggle(node?: NodeId): void;
    };
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
    exportObject(): ProvenanceGraph<State, Event>;
    import(graphString: string): void;
    importObject(graph: ProvenanceGraph<State, Event>): void;
    /**
     * Interface for capturing screenshots. When activated,
     * captures a screenshot after certain actions fire.
     */
    screenshots: ScreenshotStream;
}
