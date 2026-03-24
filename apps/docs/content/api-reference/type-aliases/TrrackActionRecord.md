[**@trrack/core**](../README)

***

[@trrack/core](../README) / TrrackActionRecord

# Type Alias: TrrackActionRecord\<DoActionType, DoActionPayload, UndoActionType, UndoActionPayload\>

> **TrrackActionRecord**\<`DoActionType`, `DoActionPayload`, `UndoActionType`, `UndoActionPayload`\> = `object`

Defined in: [registry/action.ts:30](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/registry/action.ts#L30)

## Type Parameters

### DoActionType

`DoActionType` *extends* `string`

### DoActionPayload

`DoActionPayload`

### UndoActionType

`UndoActionType` *extends* `string`

### UndoActionPayload

`UndoActionPayload`

## Properties

### do

> **do**: [`PayloadAction`](PayloadAction)\<`DoActionPayload`, `DoActionType`\>

Defined in: [registry/action.ts:36](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/registry/action.ts#L36)

***

### undo

> **undo**: [`PayloadAction`](PayloadAction)\<`UndoActionPayload`, `UndoActionType`\>

Defined in: [registry/action.ts:37](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/registry/action.ts#L37)
