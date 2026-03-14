[@trrack/core](../index) / createAction

# Function: createAction

▸ **createAction**\<`Payload`, `Type`\>(`type`): `PayloadActionCreator`\<`Payload`, `Type`\>

Creates an action creator that returns `{ type, payload }` objects and exposes
the action `type`, a `match` helper, and `toString()`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `Payload` |
| `Type` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `Type` |

#### Returns

`PayloadActionCreator`\<`Payload`, `Type`\>

#### Defined in

[packages/core/src/action.ts](/Users/jwilburn/Projects/trrackjs/packages/core/src/action.ts#L19)
