import { v4 as uuid } from 'uuid';

export class ID {
    private static ids: Map<string, boolean> = new Map();

    static get() {
        let id = uuid();

        while (this.ids.has(id)) {
            id = uuid();
        }

        this.ids.set(id, true);

        return id;
    }
}
