[**@trrack/core**](../README)

***

[@trrack/core](../README) / createStateNode

# Function: createStateNode()

> **createStateNode**\<`State`, `Event`\>(`__namedParameters`): [`StateNode`](../type-aliases/StateNode)\<`State`, `Event`\>

Defined in: [graph/components/node.ts:160](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/graph/components/node.ts#L160)

## Type Parameters

### State

`State`

### Event

`Event` *extends* `string`

## Parameters

### \_\_namedParameters

#### event

`Event`

#### initialArtifact?

`unknown`

#### initialMetadata?

`Record`\<`string`, `unknown`\>

#### label

`string`

#### parent

[`ProvenanceNode`](../type-aliases/ProvenanceNode)\<`State`, `Event`\>

#### sideEffects?

[`SideEffects`](../type-aliases/SideEffects) = `...`

#### state

[`StateLike`](../type-aliases/StateLike)\<`State`\>

## Returns

[`StateNode`](../type-aliases/StateNode)\<`State`, `Event`\>
