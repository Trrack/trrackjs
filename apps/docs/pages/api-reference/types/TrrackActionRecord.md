[@trrack/core](../index) / TrrackActionRecord

# Type alias: TrrackActionRecord\<DoActionType, DoActionPayload, UndoActionType, UndoActionPayload\>

Ƭ **TrrackActionRecord**\<`DoActionType`, `DoActionPayload`, `UndoActionType`, `UndoActionPayload`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DoActionType` | extends `string` |
| `DoActionPayload` | `DoActionPayload` |
| `UndoActionType` | extends `string` |
| `UndoActionPayload` | `UndoActionPayload` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `do` | `PayloadAction`\<`DoActionPayload`, `DoActionType`\> |
| `undo` | `PayloadAction`\<`UndoActionPayload`, `UndoActionType`\> |

#### Defined in

[packages/core/src/registry/action.ts:31](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/registry/action.ts#L31)
