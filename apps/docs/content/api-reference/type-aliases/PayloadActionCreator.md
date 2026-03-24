[**@trrack/core**](../README)

***

[@trrack/core](../README) / PayloadActionCreator

# Type Alias: PayloadActionCreator\<Payload, Type, Prepare\>

> **PayloadActionCreator**\<`Payload`, `Type`, `Prepare`\> = `IfPrepareActionMethodProvided`\<`Prepare`, `_ActionCreatorWithPreparedPayload`\<`Prepare`, `Type`\>, `IsAny`\<`Payload`, [`ActionCreatorWithPayload`](ActionCreatorWithPayload)\<`any`, `Type`\>, `IsUnknownOrNonInferrable`\<`Payload`, [`ActionCreatorWithNonInferrablePayload`](ActionCreatorWithNonInferrablePayload)\<`Type`\>, `IfVoid`\<`Payload`, [`ActionCreatorWithoutPayload`](ActionCreatorWithoutPayload)\<`Type`\>, `IfMaybeUndefined`\<`Payload`, [`ActionCreatorWithOptionalPayload`](ActionCreatorWithOptionalPayload)\<`Payload`, `Type`\>, [`ActionCreatorWithPayload`](ActionCreatorWithPayload)\<`Payload`, `Type`\>\>\>\>\>\>

Defined in: [action.ts:127](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/action.ts#L127)

## Type Parameters

### Payload

`Payload` = `void`

### Type

`Type` *extends* `string` = `string`

### Prepare

`Prepare` *extends* [`PrepareAction`](PrepareAction)\<`Payload`\> \| `void` = `void`
