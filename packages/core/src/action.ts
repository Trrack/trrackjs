/* eslint-disable @typescript-eslint/no-explicit-any */
export type PayloadAction<
    Payload = void,
    Type extends string = string,
    Meta = never,
    Error = never
> = {
    payload: Payload;
    type: Type;
} & ([Meta] extends [never] ? unknown : { meta: Meta })
    & ([Error] extends [never] ? unknown : { error: Error });

type ActionLike = {
    type: string;
};

export type PrepareAction<Payload> =
    | ((...args: any[]) => { payload: Payload })
    | ((...args: any[]) => { payload: Payload; meta: any })
    | ((...args: any[]) => { payload: Payload; error: any })
    | ((...args: any[]) => { payload: Payload; meta: any; error: any });

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

type BaseActionCreator<
    Payload,
    Type extends string,
    Meta = never,
    Error = never
> = {
    type: Type;
    toString(): Type;
    match(action: unknown): action is PayloadAction<Payload, Type, Meta, Error>;
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

export type ActionCreatorWithPreparedPayload<
    Args extends unknown[],
    Payload,
    Type extends string = string,
    Error = never,
    Meta = never
> = BaseActionCreator<Payload, Type, Meta, Error> & {
    (...args: Args): PayloadAction<Payload, Type, Meta, Error>;
};

type PreparedPayloadActionCreator<
    Prepare extends PrepareAction<any>,
    Type extends string
> = ActionCreatorWithPreparedPayload<
    Parameters<Prepare>,
    ReturnType<Prepare>['payload'],
    Type,
    ReturnType<Prepare> extends { error: infer Error } ? Error : never,
    ReturnType<Prepare> extends { meta: infer Meta } ? Meta : never
>;

type _ActionCreatorWithPreparedPayload<
    Prepare extends PrepareAction<any> | void,
    Type extends string = string
> = Prepare extends PrepareAction<any>
    ? PreparedPayloadActionCreator<Prepare, Type>
    : void;

type IfPrepareActionMethodProvided<Prepare, True, False> = Prepare extends (
    ...args: any[]
) => any
    ? True
    : False;

export type PayloadActionCreator<
    Payload = void,
    Type extends string = string,
    Prepare extends PrepareAction<Payload> | void = void
> = IfPrepareActionMethodProvided<
    Prepare,
    _ActionCreatorWithPreparedPayload<Prepare, Type>,
    IsAny<
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
    >
>;

export function createAction<Payload = void, Type extends string = string>(
    type: Type
): PayloadActionCreator<Payload, Type>;
export function createAction<
    Prepare extends PrepareAction<any>,
    Type extends string = string
>(
    type: Type,
    prepareAction: Prepare
): PayloadActionCreator<ReturnType<Prepare>['payload'], Type, Prepare>;
export function createAction(type: string, prepareAction?: PrepareAction<any>) {
    const actionCreator = ((...args: unknown[]) => {
        if (prepareAction) {
            return {
                ...prepareAction(...args),
                type,
            };
        }

        return {
            payload: args[0],
            type,
        };
    }) as PayloadActionCreator<unknown, string>;

    actionCreator.type = type;
    actionCreator.toString = () => type;
    actionCreator.match = (
        action: unknown
    ): action is PayloadAction<unknown, string> =>
        typeof action === 'object'
        && action !== null
        && 'type' in action
        && (action as ActionLike).type === type;

    return actionCreator;
}
