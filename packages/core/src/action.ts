type IsAny<T> = 0 extends 1 & T ? true : false;

export type PayloadAction<Payload = void, Type extends string = string> =
    {
        type: Type;
    } & (IsAny<Payload> extends true
        ? {
              payload: Payload;
          }
        : [Payload] extends [void]
        ? {
              payload?: undefined;
          }
        : {
              payload: Payload;
          });

export type ActionCreatorWithoutPayload<Type extends string = string> = {
    (): PayloadAction<void, Type>;
    type: Type;
    match(action: { type: string }): action is PayloadAction<void, Type>;
    toString(): Type;
};

export type ActionCreatorWithPayload<
    Payload,
    Type extends string = string
> = {
    (payload: Payload): PayloadAction<Payload, Type>;
    type: Type;
    match(action: { type: string }): action is PayloadAction<Payload, Type>;
    toString(): Type;
};

export type PayloadActionCreator<
    Payload = void,
    Type extends string = string
> = [Payload] extends [void]
    ? ActionCreatorWithoutPayload<Type>
    : ActionCreatorWithPayload<Payload, Type>;

export function createAction<Type extends string>(
    type: Type
): ActionCreatorWithoutPayload<Type>;
export function createAction<Payload, Type extends string = string>(
    type: Type
): ActionCreatorWithPayload<Payload, Type>;
export function createAction(type: string) {
    const creator = function (payload?: unknown) {
        if (arguments.length === 0) {
            return {
                type,
            };
        }

        return {
            type,
            payload,
        };
    };

    creator.type = type;
    creator.match = (action: { type: string }) => action.type === type;
    creator.toString = () => type;

    return creator;
}
