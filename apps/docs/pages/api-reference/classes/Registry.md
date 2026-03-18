[@trrack/core](../index) / Registry

# Class: Registry\<Event\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Event` | extends `string` |

## Table of contents

### Methods

- [get](Registry#get)
- [has](Registry#has)
- [register](Registry#register)
- [create](Registry#create)

## Methods

### get

▸ **get**(`type`): `TrrackActionRegisteredObject`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`TrrackActionRegisteredObject`

#### Defined in

[packages/core/src/registry/reg.ts:84](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/registry/reg.ts#L84)

___

### has

▸ **has**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/core/src/registry/reg.ts:37](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/registry/reg.ts#L37)

___

### register

▸ **register**\<`DoActionType`, `UndoActionType`, `DoActionPayload`, `UndoActionPayload`, `State`\>(`type`, `actionFunction`, `config?`): `IsAny`\<`DoActionPayload`, `ActionCreatorWithPayload`\<`any`, `string`\>, `IsUnknown`\<`DoActionPayload`, `ActionCreatorWithNonInferrablePayload`\<`string`\>, `IfVoid`\<`DoActionPayload`, `ActionCreatorWithoutPayload`\<`string`\>, `IfMaybeUndefined`\<`DoActionPayload`, `ActionCreatorWithOptionalPayload`\<`DoActionPayload`, `string`\>, `ActionCreatorWithPayload`\<`DoActionPayload`, `string`\>\>\>\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DoActionType` | extends `string` |
| `UndoActionType` | extends `string` |
| `DoActionPayload` | `any` |
| `UndoActionPayload` | `any` |
| `State` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `DoActionType` |
| `actionFunction` | [`TrrackActionFunction`](../types/TrrackActionFunction)\<`DoActionType`, `UndoActionType`, `UndoActionPayload`, `DoActionPayload`\> \| [`StateChangeFunction`](../types/StateChangeFunction)\<`State`, `DoActionPayload`\> |
| `config?` | `Object` |
| `config.eventType` | `Event` |
| `config.label` | `string` \| [`LabelGenerator`](../types/LabelGenerator)\<`DoActionPayload`\> |

#### Returns

`IsAny`\<`DoActionPayload`, `ActionCreatorWithPayload`\<`any`, `string`\>, `IsUnknown`\<`DoActionPayload`, `ActionCreatorWithNonInferrablePayload`\<`string`\>, `IfVoid`\<`DoActionPayload`, `ActionCreatorWithoutPayload`\<`string`\>, `IfMaybeUndefined`\<`DoActionPayload`, `ActionCreatorWithOptionalPayload`\<`DoActionPayload`, `string`\>, `ActionCreatorWithPayload`\<`DoActionPayload`, `string`\>\>\>\>\>

#### Defined in

[packages/core/src/registry/reg.ts:41](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/registry/reg.ts#L41)

___

### create

▸ **create**\<`Event`\>(): [`Registry`](Registry)\<`Event`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Event` | extends `string` |

#### Returns

[`Registry`](Registry)\<`Event`\>

#### Defined in

[packages/core/src/registry/reg.ts:27](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/registry/reg.ts#L27)
