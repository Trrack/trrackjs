[@trrack/core](../index) / RecordActionArgs

# Type alias: RecordActionArgs\<State, Event\>

Ƭ **RecordActionArgs**\<`State`, `Event`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `State` | `State` |
| `Event` | extends `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventType` | `Event` |
| `label` | `string` |
| `onlySideEffects?` | `boolean` |
| `sideEffects` | [`SideEffects`](SideEffects) |
| `state` | `State` |

#### Defined in

[packages/core/src/provenance/types.ts:17](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L17)
