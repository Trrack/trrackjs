[**@trrack/core**](../README)

***

[@trrack/core](../README) / PayloadAction

# Type Alias: PayloadAction\<Payload, Type, Meta, Error\>

> **PayloadAction**\<`Payload`, `Type`, `Meta`, `Error`\> = `object` & \[`Meta`\] *extends* \[`never`\] ? `unknown` : `object` & \[`Error`\] *extends* \[`never`\] ? `unknown` : `object`

Defined in: [action.ts:2](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/action.ts#L2)

## Type Declaration

### payload

> **payload**: `Payload`

### type

> **type**: `Type`

## Type Parameters

### Payload

`Payload` = `void`

### Type

`Type` *extends* `string` = `string`

### Meta

`Meta` = `never`

### Error

`Error` = `never`
