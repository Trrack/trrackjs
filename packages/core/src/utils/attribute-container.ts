/* eslint-disable @typescript-eslint/no-explicit-any */

export class AttributeContainer {
    private attributeMap = new Map<string, any>();

    setAttr<T>(name: string, value: T) {
        this.attributeMap.set(name, value);
    }

    getAttr<T>(name: string, defaultValue: T | null = null) {
        const val = this.attributeMap.get(name) as T;
        if (val) return val;

        return defaultValue;
    }

    hasAttr(name: string) {
        return this.attributeMap.has(name);
    }

    get attributes() {
        return Array.from(this.attributeMap.keys());
    }
}
