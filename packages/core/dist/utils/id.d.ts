/**
 * Type to add branding flavor
 */
type Flavoring<TFlavor> = {
    _type?: TFlavor;
};
export type FlavoredId<TBaseId, TFlavor> = TBaseId & Flavoring<TFlavor>;
export declare class ID {
    private static ids;
    static get(): string;
}
export {};
