[**@trrack/core**](../README)

***

[@trrack/core](../README) / TrrackActionFunction

# Type Alias: TrrackActionFunction()\<DoActionType, UndoActionType, UndoActionPayload, DoActionPayload\>

> **TrrackActionFunction**\<`DoActionType`, `UndoActionType`, `UndoActionPayload`, `DoActionPayload`\> = (`args`) => `object`

Defined in: [registry/action.ts:4](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/action.ts#L4)

## Type Parameters

### DoActionType

`DoActionType` *extends* `string`

### UndoActionType

`UndoActionType` *extends* `string`

### UndoActionPayload

`UndoActionPayload`

### DoActionPayload

`DoActionPayload`

## Parameters

### args

`DoActionPayload`

## Returns

`object`

### do?

> `optional` **do**: [`PayloadAction`](PayloadAction)\<`DoActionPayload`, `DoActionType`\>

### undo

> **undo**: [`PayloadAction`](PayloadAction)\<`UndoActionPayload`, `UndoActionType`\>
