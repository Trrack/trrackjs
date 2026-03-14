import { createAction } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';

import { initializeTrrack } from '../src/provenance/trrack';
import { TrrackEvents } from '../src/provenance/trrack-events';
import { Registry } from '../src/registry';

type ComplexState = {
    a: number;
    b: number;
    c: number;
    d: number;
};

type ComplexEvent = 'small-change' | 'large-change' | 'mark' | 'unmark';

function setupTrrack(log: string[] = []) {
    const registry = Registry.create<ComplexEvent>();

    const smallChange = registry.register<
        'small-change',
        string,
        number,
        never,
        ComplexState
    >('small-change', (state, amount) => {
        state.a += amount;
        return state;
    });

    const largeChange = registry.register<
        'large-change',
        string,
        number,
        never,
        ComplexState
    >('large-change', (state, amount) => {
        state.a += amount;
        state.b += amount;
        state.c += amount;
        return state;
    });

    const mark = registry.register('mark', (label: string) => {
        log.push(`do:${label}`);
        return {
            undo: createAction<string>('unmark')(label),
        };
    });

    registry.register('unmark', (label: string) => {
        log.push(`undo:${label}`);
        return {
            undo: createAction<string>('mark')(label),
        };
    });

    const trrack = initializeTrrack<ComplexState, ComplexEvent>({
        registry,
        initialState: {
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        },
    });

    return { trrack, smallChange, largeChange, mark };
}

describe('trrack', () => {
    it('stores small changes as patches and larger changes as checkpoints', async () => {
        const { trrack, largeChange, smallChange } = setupTrrack();

        await trrack.apply('Small change', smallChange(1));
        expect(trrack.current.state.type).toBe('patch');

        await trrack.apply('Large change', largeChange(1));
        expect(trrack.current.state.type).toBe('checkpoint');
    });

    it('handles root-level replacement patches when determining the save strategy', async () => {
        const registry = Registry.create<'replace'>();
        const replace = registry.register<'replace', string, unknown, never, unknown>(
            'replace',
            (_state, nextState) => nextState
        );

        const trrack = initializeTrrack<unknown, 'replace'>({
            registry,
            initialState: {
                a: 1,
                b: 2,
            },
        });

        await trrack.apply('Replace state', replace([]));

        expect(trrack.current.state.type).toBe('checkpoint');
        expect(trrack.getState()).toEqual([]);
    });

    it('supports only-side-effect records and preserves current state', () => {
        const { trrack } = setupTrrack();

        trrack.record({
            label: 'Side effect only',
            onlySideEffects: true,
            eventType: 'mark',
            sideEffects: {
                do: [createAction<string>('mark')('A')],
                undo: [createAction<string>('unmark')('A')],
            },
            state: trrack.getState(),
        });

        expect(trrack.current.label).toBe('Side effect only');
        expect(trrack.current.state.type).toBe('checkpoint');
        expect(trrack.getState()).toEqual({
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        });
    });

    it('emits traversal start and end events and updates isTraversing around traversal', async () => {
        const { trrack, smallChange } = setupTrrack();
        const events: Array<{ event: string; traversing: boolean }> = [];

        await trrack.apply('Small change', smallChange(1));

        trrack.on(TrrackEvents.TRAVERSAL_START, () => {
            events.push({
                event: TrrackEvents.TRAVERSAL_START,
                traversing: trrack.isTraversing,
            });
        });
        trrack.on(TrrackEvents.TRAVERSAL_END, () => {
            events.push({
                event: TrrackEvents.TRAVERSAL_END,
                traversing: trrack.isTraversing,
            });
        });

        await trrack.undo();

        expect(events).toEqual([
            { event: TrrackEvents.TRAVERSAL_START, traversing: true },
            { event: TrrackEvents.TRAVERSAL_END, traversing: false },
        ]);
        expect(trrack.isTraversing).toBe(false);
    });

    it('returns a tree view rooted at the root node', async () => {
        const { trrack, mark, smallChange } = setupTrrack();

        await trrack.apply('First', smallChange(1));
        await trrack.apply('Mark', mark('branch-a'));
        await trrack.undo();
        await trrack.undo();
        await trrack.apply('Second', smallChange(2));

        const tree = trrack.tree() as {
            children: Array<{ label: string; children: Array<{ label: string }> }>;
            label: string;
            name: string;
        };

        expect(tree.label).toBe('Root');
        expect(tree.name).toBe('Root');
        expect(tree.children.map((child) => child.label)).toEqual([
            'First',
            'Second',
        ]);
        expect(tree.children[0]?.children[0]?.label).toBe('Mark');
    });

    it('reports placeholder done behavior', () => {
        const { trrack } = setupTrrack();
        const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

        trrack.done();

        expect(log).toHaveBeenCalledWith('Setup later for URL sharing.');

        log.mockRestore();
    });

    it('reconstructs state across chained patch nodes and preserves it through import/export', async () => {
        const { trrack, smallChange } = setupTrrack();

        await trrack.apply('Small 1', smallChange(1));
        const firstPatchNode = trrack.current;
        await trrack.apply('Small 2', smallChange(2));

        expect(firstPatchNode.state.type).toBe('patch');
        expect(trrack.current.state.type).toBe('patch');
        expect(trrack.getState(firstPatchNode)).toEqual({
            a: 1,
            b: 0,
            c: 0,
            d: 0,
        });
        expect(trrack.getState()).toEqual({
            a: 3,
            b: 0,
            c: 0,
            d: 0,
        });

        const exported = trrack.exportObject();
        const { trrack: importedTrrack } = setupTrrack();
        importedTrrack.importObject(exported);

        expect(importedTrrack.getState()).toEqual({
            a: 3,
            b: 0,
            c: 0,
            d: 0,
        });
        expect(importedTrrack.current.id).toBe(trrack.current.id);
        expect(importedTrrack.getState(importedTrrack.graph.backend.nodes[firstPatchNode.id]!)).toEqual({
            a: 1,
            b: 0,
            c: 0,
            d: 0,
        });
    });

    it('preserves side-effect traversal history through import/export', async () => {
        const exportLog: string[] = [];
        const { mark, trrack } = setupTrrack(exportLog);

        await trrack.apply('Mark A', mark('A'));
        const branchANodeId = trrack.current.id;
        await trrack.undo();
        await trrack.apply('Mark B', mark('B'));

        const exported = trrack.exportObject();

        const importLog: string[] = [];
        const { trrack: importedTrrack } = setupTrrack(importLog);

        importedTrrack.importObject(exported);
        await Promise.resolve();

        expect(importLog).toEqual(['do:B']);
        expect(importedTrrack.current.id).toBe(trrack.current.id);

        importLog.length = 0;
        await importedTrrack.to(branchANodeId);

        expect(importLog).toEqual(['undo:B', 'do:A']);
    });

    it('preserves side-effect branch traversal history through string export/import and redo selection', async () => {
        const { mark, trrack } = setupTrrack();

        await trrack.apply('Mark A', mark('A'));
        const branchANodeId = trrack.current.id;
        await trrack.undo();
        await trrack.apply('Mark B', mark('B'));

        const exported = trrack.export();
        const importLog: string[] = [];
        const { trrack: importedTrrack } = setupTrrack(importLog);

        importedTrrack.import(exported);
        await Promise.resolve();

        expect(importLog).toEqual(['do:B']);
        expect(importedTrrack.current.id).not.toBe(branchANodeId);

        importLog.length = 0;
        await importedTrrack.to(importedTrrack.root.id);
        await importedTrrack.redo('oldest');

        expect(importLog).toEqual(['undo:B', 'do:A']);
        expect(importedTrrack.current.id).toBe(branchANodeId);
    });
});
