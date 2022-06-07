type GenericArgs = readonly unknown[];

type Listener<T extends GenericArgs> = (...args: T) => void;

type UnsubscribeListener = () => void;

type EventManager<T extends GenericArgs> = {
  subscribe: (event: string, eventListener: Listener<T>) => UnsubscribeListener;
  emit: (event: string, ...args: T) => boolean;
  getListeners: (event: string) => Listener<T>[];
  clearEvent: (event: string) => void;
};

export function initEventManager<T extends GenericArgs>(): EventManager<T> {
  const events: Map<string, Listener<T>[]> = new Map();
  return {
    subscribe(event: string, listener: Listener<T>) {
      let registeredListeners = events.get(event);

      if (!registeredListeners) {
        registeredListeners = [];
        events.set(event, registeredListeners);
      }

      registeredListeners.push(listener);

      return () => {
        if (registeredListeners) {
          registeredListeners.splice(registeredListeners.indexOf(listener), 1);
        }
      };
    },
    emit(event, ...args: T) {
      const registeredListeners = events.get(event);

      if (registeredListeners)
        registeredListeners.forEach((listener) => listener(...args));

      return (
        registeredListeners !== undefined && registeredListeners.length > 0
      );
    },
    getListeners(event: string) {
      const listeners = events.get(event);

      if (!listeners) throw new Error(`No listeners registered for ${event}`);

      return listeners;
    },
    clearEvent(event: string) {
      events.set(event, []);
    },
  };
}
