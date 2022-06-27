type Args = readonly unknown[];

type EventArgumentMap<ArgArray extends Args> = { [key: string]: ArgArray };

type Listener<ArgArray extends Args> = (...args: ArgArray) => void;

type Unsubscriber = () => void;

// TODO: Fix argument inference
export function initEventManager<
    TEventMap extends EventArgumentMap<Args> = { [key: string]: any[] },
    TEventKey extends keyof TEventMap = keyof TEventMap,
    TEventArgs extends TEventMap[TEventKey] = TEventMap[TEventKey]
>() {
    const events: Map<TEventKey, Array<Listener<TEventArgs>>> = new Map();

    return {
        subscribe(
            event: TEventKey,
            listener: Listener<TEventArgs>
        ): Unsubscriber {
            let registeredListeners = events.get(event);

            if (!registeredListeners) {
                registeredListeners = [];
                events.set(event, registeredListeners);
            }

            registeredListeners.push(listener);

            return () => {
                if (registeredListeners) {
                    registeredListeners.splice(
                        registeredListeners.indexOf(listener),
                        1
                    );
                }
            };
        },
        emit(event: TEventKey, ...args: TEventArgs) {
            const registeredListeners = events.get(event);

            if (registeredListeners) {
                registeredListeners.forEach((listener) => listener(...args));
                return true;
            }

            return false;
        },
        getListeners(event: TEventKey) {
            const registeredListeners = events.get(event);

            if (!registeredListeners)
                throw new Error('No registered listeners');

            return registeredListeners;
        },
        clearEvent(event: TEventKey) {
            events.set(event, []);
        },
    };
}
