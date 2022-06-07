export type Listener = <T extends readonly unknown[]>(...args: T) => void;

export interface IObservable<Events extends string> {
    listenerMap: Record<Events, Listener[]>;
    subscribe(event: Events, listeners: Listener | Listener[]): void;
}
export abstract class AObservable<Events extends string>
    implements IObservable<Events>
{
    abstract listenerMap: Record<Events, Listener[]>;

    subscribe(event: Events, listeners: Listener | Listener[]) {
        if (listeners instanceof Array)
            this.listenerMap[event].push(...listeners);
        else this.listenerMap[event].push(listeners);
    }

    notify(event: Events) {
        this.listenerMap[event].forEach((listener) => {
            listener();
        });
    }
}
