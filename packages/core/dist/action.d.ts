export type PayloadAction<Payload = void, Type extends string = string> = {
    type: Type;
    payload: Payload;
};
export type ActionCreatorWithPayload<Payload, Type extends string = string> = {
    (payload: Payload): PayloadAction<Payload, Type>;
    type: Type;
    match(action: {
        type: string;
    }): action is PayloadAction<Payload, Type>;
    toString(): Type;
};
export type PayloadActionCreator<Payload, Type extends string = string> = ActionCreatorWithPayload<Payload, Type>;
export declare function createAction<Payload, Type extends string = string>(type: Type): PayloadActionCreator<Payload, Type>;
