[@trrack/core](../index) / TrrackActionFunction

# Type alias: TrrackActionFunction\<DoActionType, UndoActionType, UndoActionPayload, DoActionPayload\>

Ƭ **TrrackActionFunction**\<`DoActionType`, `UndoActionType`, `UndoActionPayload`, `DoActionPayload`\>: (`args`: `DoActionPayload`) => \{ `do?`: `PayloadAction`\<`DoActionPayload`, `DoActionType`\> ; `undo`: `PayloadAction`\<`UndoActionPayload`, `UndoActionType`\>  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DoActionType` | extends `string` |
| `UndoActionType` | extends `string` |
| `UndoActionPayload` | `UndoActionPayload` |
| `DoActionPayload` | `DoActionPayload` |

#### Type declaration

▸ (`args`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `DoActionPayload` |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `do?` | `PayloadAction`\<`DoActionPayload`, `DoActionType`\> |
| `undo` | `PayloadAction`\<`UndoActionPayload`, `UndoActionType`\> |

#### Defined in

[packages/core/src/registry/action.ts:4](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/registry/action.ts#L4)
