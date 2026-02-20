[@trrack/core](../index) / createAction

# Function: createAction

▸ **createAction**\<`P`, `T`\>(`type`): `PayloadActionCreator`\<`P`, `T`\>

A utility function to create an action creator for the given action type
string. The action creator accepts a single argument, which will be included
in the action object as a field called payload. The action creator function
will also have its toString() overridden so that it returns the action type,
allowing it to be used in reducer logic that is looking for that action type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `void` |
| `T` | extends `string` = `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | The action type to use for created actions. |

#### Returns

`PayloadActionCreator`\<`P`, `T`\>

#### Defined in

node_modules/@reduxjs/toolkit/dist/createAction.d.ts:163

▸ **createAction**\<`PA`, `T`\>(`type`, `prepareAction`): `PayloadActionCreator`\<`ReturnType`\<`PA`\>[``"payload"``], `T`, `PA`\>

A utility function to create an action creator for the given action type
string. The action creator accepts a single argument, which will be included
in the action object as a field called payload. The action creator function
will also have its toString() overridden so that it returns the action type,
allowing it to be used in reducer logic that is looking for that action type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PA` | extends `PrepareAction`\<`any`\> |
| `T` | extends `string` = `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | The action type to use for created actions. |
| `prepareAction` | `PA` | - |

#### Returns

`PayloadActionCreator`\<`ReturnType`\<`PA`\>[``"payload"``], `T`, `PA`\>

#### Defined in

node_modules/@reduxjs/toolkit/dist/createAction.d.ts:177
