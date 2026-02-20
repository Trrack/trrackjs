[@trrack/core](../index) / StateNode

# Type alias: StateNode\<State, Event\>

Ƭ **StateNode**\<`State`, `Event`\>: `BaseNode`\<`State`\> & \{ `event`: `Event` ; `parent`: [`NodeId`](NodeId) ; `sideEffects`: [`SideEffects`](SideEffects)  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `State` | `State` |
| `Event` | extends `string` |

#### Defined in

[packages/core/src/graph/components/node.ts:78](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/graph/components/node.ts#L78)
