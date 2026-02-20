export declare function initEventManager(): {
    listen(event: string, listener: (args: any) => void): () => void;
    fire(event: string, args?: any): void;
};
