import { Omnibus } from 'omnibus-rxjs';

export class EventBus {
    static create<T>() {
        return new Omnibus<T>();
    }
}
