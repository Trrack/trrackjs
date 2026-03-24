[**@trrack/core**](../README)

***

[@trrack/core](../README) / ActionCreatorWithPreparedPayload

# Type Alias: ActionCreatorWithPreparedPayload\<Args, Payload, Type, Error, Meta\>

> **ActionCreatorWithPreparedPayload**\<`Args`, `Payload`, `Type`, `Error`, `Meta`\> = `BaseActionCreator`\<`Payload`, `Type`, `Meta`, `Error`\> & (...`args`) => [`PayloadAction`](PayloadAction)\<`Payload`, `Type`, `Meta`, `Error`\>

Defined in: [action.ts:93](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/action.ts#L93)

## Type Parameters

### Args

`Args` *extends* `unknown`[]

### Payload

`Payload`

### Type

`Type` *extends* `string` = `string`

### Error

`Error` = `never`

### Meta

`Meta` = `never`
