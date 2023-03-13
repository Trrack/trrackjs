import { initEventManager } from '../src/event/index';
describe('Event Manager', () => {
    it('should create an instance of EventManager', () => {
        const eventManager = initEventManager();

        expect(eventManager).toBeDefined();
        expect(eventManager).toHaveProperty('listen');
        expect(typeof eventManager.listen).toBe('function');

        expect(eventManager).toHaveProperty('fire');
        expect(typeof eventManager.fire).toBe('function');
    });

    it('should attach event listener and trigger without arguments', () => {
        const eventManager = initEventManager();

        const EVENT = 'test';

        let count = 0;

        const handler = vi.fn(() => {
            count = count + 1;
        });

        eventManager.listen(EVENT, handler);

        expect(handler).not.toHaveBeenCalled();
        expect(count).toBe(0);

        eventManager.fire(EVENT);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(count).toBe(1);

        eventManager.fire(EVENT);
        expect(handler).toHaveBeenCalledTimes(2);
        expect(count).toBe(2);
    });

    it('should attach event listener and trigger with arguments', () => {
        const eventManager = initEventManager();

        const EVENT = 'test';

        const arr: string[] = [];

        const ARG1 = 'Test 1';
        const ARG2 = 'Test 2';

        const handler = vi.fn((toAdd: string) => {
            arr.push(toAdd);
        });

        eventManager.listen(EVENT, handler);

        expect(handler).not.toHaveBeenCalled();
        expect(arr.length).toBe(0);

        eventManager.fire(EVENT, ARG1);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(arr.length).toBe(1);
        expect(arr).toContain(ARG1);

        eventManager.fire(EVENT, ARG2);
        expect(handler).toHaveBeenCalledTimes(2);
        expect(arr.length).toBe(2);
        expect(arr).toContain(ARG2);
    });
});
