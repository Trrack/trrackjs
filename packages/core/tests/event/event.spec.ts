import { initEventManager } from '../../src/event';

const TEST_EVENT = 'test-event';

describe('Event Manager', () => {
  it('should exist', () => {
    const eventManager = initEventManager();

    expect(eventManager).toBeDefined();
  });
});

describe('Listener Registration', () => {
  it('should be able to register listener for an event', () => {
    const eventManager = initEventManager();

    function handler() {
      return;
    }

    eventManager.subscribe(TEST_EVENT, handler);

    const eventHandlers = eventManager.getListeners(TEST_EVENT);

    expect(eventHandlers).toHaveLength(1);
    expect(eventHandlers[0].toString()).toEqual(handler.toString());
  });
  it('should throw if no listeners are registered', () => {
    const eventManager = initEventManager();

    expect(() => eventManager.getListeners(TEST_EVENT)).toThrow();
  });

  it('should recieve as unsubscriber when registering an listener', () => {
    const eventManager = initEventManager();

    const handler = () => {
      return 1;
    };

    const unsubscribe = eventManager.subscribe(TEST_EVENT, handler);

    expect(unsubscribe).toBeDefined();
    expect(unsubscribe).toBeInstanceOf(Function);
  });

  it('should be able to unregister listener using unsubscriber', () => {
    const eventManager = initEventManager();

    const handler = () => {
      return 1;
    };

    const unsubscribe = eventManager.subscribe(TEST_EVENT, handler);

    expect(eventManager.getListeners(TEST_EVENT)).toHaveLength(1);
    unsubscribe();
    expect(eventManager.getListeners(TEST_EVENT)).toHaveLength(0);
  });

  it('should be able to register multiple listeners for an event', () => {
    const eventManager = initEventManager();

    const handler = () => {
      return 1;
    };

    const handler2 = () => {
      return 2;
    };

    eventManager.subscribe(TEST_EVENT, handler);
    eventManager.subscribe(TEST_EVENT, handler2);

    const eventHandlers = eventManager.getListeners(TEST_EVENT);

    expect(eventHandlers).toHaveLength(2);
    expect(eventHandlers[0].toString()).toEqual(handler.toString());
    expect(eventHandlers[1].toString()).toEqual(handler2.toString());
  });

  it('should be able to clear all registered listeners', () => {
    const eventManager = initEventManager();

    const handler = () => {
      return 1;
    };

    const handler2 = () => {
      return 2;
    };

    eventManager.subscribe(TEST_EVENT, handler);
    eventManager.subscribe(TEST_EVENT, handler2);

    expect(eventManager.getListeners(TEST_EVENT)).toHaveLength(2);
    eventManager.clearEvent(TEST_EVENT);
    expect(eventManager.getListeners(TEST_EVENT)).toHaveLength(0);
  });
});

describe('Event Emitter', () => {
  it('should return true on emit when atleast one listener is registered', () => {
    const eventManager = initEventManager();

    const handler = () => {
      return 1;
    };

    const handler2 = () => {
      return 2;
    };

    eventManager.subscribe(TEST_EVENT, handler);
    const firstEmitStatus = eventManager.emit(TEST_EVENT);
    expect(firstEmitStatus).toBeTruthy();

    eventManager.subscribe(TEST_EVENT, handler2);
    const secondEmitStatus = eventManager.emit(TEST_EVENT);
    expect(secondEmitStatus).toBeTruthy();
  });

  it('should return false on emit when no listener is registered', () => {
    const eventManager = initEventManager();

    const emitStatus = eventManager.emit(TEST_EVENT);
    expect(emitStatus).toBeFalsy();
  });

  it('should call listener on emit', () => {
    const eventManager = initEventManager();

    const mockHandler = jest.fn(() => {
      return 1;
    });

    eventManager.subscribe(TEST_EVENT, mockHandler);

    eventManager.emit(TEST_EVENT);

    expect(mockHandler).toBeCalledTimes(1);
  });

  it('should call multiple listeners on emit', () => {
    const eventManager = initEventManager();

    const mockHandler1 = jest.fn(() => {
      return 1;
    });

    const mockHandler2 = jest.fn(() => {
      return 2;
    });

    eventManager.subscribe(TEST_EVENT, mockHandler1);
    eventManager.subscribe(TEST_EVENT, mockHandler2);

    eventManager.emit(TEST_EVENT);

    expect(mockHandler1).toBeCalledTimes(1);
    expect(mockHandler2).toBeCalledTimes(1);
  });
});
