import { describe, expect, it, vi } from 'vitest';

import { initEventManager } from './index';

describe('Event Manager', () => {
    it('creates an event manager with listen and fire methods', () => {
        const eventManager = initEventManager();

        expect(eventManager).toBeDefined();
        expect(typeof eventManager.listen).toBe('function');
        expect(typeof eventManager.fire).toBe('function');
    });

    it('triggers listeners with and without arguments', () => {
        const eventManager = initEventManager();
        const handler = vi.fn();

        eventManager.listen('test', handler);

        eventManager.fire('test');
        eventManager.fire('test', 'payload');

        expect(handler).toHaveBeenNthCalledWith(1, undefined);
        expect(handler).toHaveBeenNthCalledWith(2, 'payload');
    });

    it('supports unsubscribing listeners and firing unknown events safely', () => {
        const eventManager = initEventManager();
        const handler = vi.fn();

        const unsubscribe = eventManager.listen('test', handler);

        eventManager.fire('missing');
        expect(handler).not.toHaveBeenCalled();

        eventManager.fire('test', 'before');
        expect(handler).toHaveBeenCalledTimes(1);

        unsubscribe();
        expect(unsubscribe()).toBeUndefined();

        eventManager.fire('test', 'after');
        expect(handler).toHaveBeenCalledTimes(1);
    });
});
