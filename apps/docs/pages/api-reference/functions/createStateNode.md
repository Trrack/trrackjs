[@trrack/core](../index) / createStateNode

# Function: createStateNode

▸ **createStateNode**\<`State`, `Event`\>(`«destructured»`): [`StateNode`](../types/StateNode)\<`State`, `Event`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `State` | `State` |
| `Event` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `event` | `Event` |
| › `initialArtifact?` | `unknown` |
| › `initialMetadata?` | `Record`\<`string`, `unknown`\> |
| › `label` | `string` |
| › `parent` | [`ProvenanceNode`](../types/ProvenanceNode)\<`State`, `Event`\> |
| › `sideEffects?` | [`SideEffects`](../types/SideEffects) |
| › `state` | [`StateLike`](../types/StateLike)\<`State`\> |

#### Returns

[`StateNode`](../types/StateNode)\<`State`, `Event`\>

#### Defined in

[packages/core/src/graph/components/node.ts:160](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/graph/components/node.ts#L160)
