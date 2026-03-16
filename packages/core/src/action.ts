export type PayloadAction<Payload = void, Type extends string = string> = {
    payload: Payload;
    type: Type;
};

type ActionLike = {
    type: string;
};

type IsAny<T, True, False = never> = true | false extends (
    T extends never ? true : false
)
    ? True
    : False;

type IsUnknown<T, True, False = never> = unknown extends T
    ? IsAny<T, False, True>
    : False;

type IfMaybeUndefined<Payload, True, False> = [undefined] extends [Payload]
    ? True
    : False;

type IfVoid<Payload, True, False> = [void] extends [Payload] ? True : False;

type IsEmptyObject<T, True, False = never> = T extends unknown
    ? keyof T extends never
        ? IsUnknown<T, False, IfMaybeUndefined<T, False, IfVoid<T, False, True>>>
        : False
    : never;

type AtLeastTs35<True, False> = [True, False][IsUnknown<
    ReturnType<(<T>() => T)>,
    0,
    1
>];

type IsUnknownOrNonInferrable<T, True, False> = AtLeastTs35<
    IsUnknown<T, True, False>,
    IsEmptyObject<T, True, IsUnknown<T, True, False>>
>;

type BaseActionCreator<Payload, Type extends string> = {
    type: Type;
    toString(): Type;
    match(action: ActionLike): action is PayloadAction<Payload, Type>;
};

export type ActionCreatorWithPayload<
    Payload,
    Type extends string = string
> = BaseActionCreator<Payload, Type> & {
    (payload: Payload): PayloadAction<Payload, Type>;
};

export type ActionCreatorWithOptionalPayload<
    Payload,
    Type extends string = string
> = BaseActionCreator<Payload, Type> & {
    (payload?: Payload): PayloadAction<Payload, Type>;
};

export type ActionCreatorWithoutPayload<
    Type extends string = string
> = BaseActionCreator<undefined, Type> & {
    (noArgument: void): PayloadAction<undefined, Type>;
};

export type ActionCreatorWithNonInferrablePayload<
    Type extends string = string
> = BaseActionCreator<unknown, Type> & {
    <Payload>(payload: Payload): PayloadAction<Payload, Type>;
};

export type PayloadActionCreator<
    Payload = void,
    Type extends string = string
> = IsAny<
    Payload,
    // `any` must stay explicit here to preserve RTK-compatible payload behavior.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ActionCreatorWithPayload<any, Type>,
    IsUnknownOrNonInferrable<
        Payload,
        ActionCreatorWithNonInferrablePayload<Type>,
        IfVoid<
            Payload,
            ActionCreatorWithoutPayload<Type>,
            IfMaybeUndefined<
                Payload,
                ActionCreatorWithOptionalPayload<Payload, Type>,
                ActionCreatorWithPayload<Payload, Type>
            >
        >
    >
>;

export function createAction<Payload = void, Type extends string = string>(
    type: Type
): PayloadActionCreator<Payload, Type>;
export function createAction(type: string) {
    const actionCreator = ((payload?: unknown) => ({
        payload,
        type,
    })) as PayloadActionCreator<unknown, string>;

    actionCreator.type = type;
    actionCreator.toString = () => type;
    actionCreator.match = (
        action: ActionLike
    ): action is PayloadAction<unknown, string> => action.type === type;

    return actionCreator;
}
