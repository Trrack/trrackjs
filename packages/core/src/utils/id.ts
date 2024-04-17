import { v4 as uuid } from 'uuid';

/**
 * Type to add branding flavor
 */
type Flavoring<TFlavor> = {
    _type?: TFlavor;
};

//'https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
export type FlavoredId<TBaseId, TFlavor> = TBaseId & Flavoring<TFlavor>;

function IDFactory() {
    const ids = new Map<string, boolean>();

    return {
        get() {
            let id = uuid();

            while (ids.has(id)) {
                id = uuid();
            }

            ids.set(id, true);

            return id;
        },
    };
}

export const ID = IDFactory();
