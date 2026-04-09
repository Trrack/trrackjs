[**@trrack/core**](../index)

***

[@trrack/core](../index) / Trrack

# Interface: Trrack\<State, Event\>

Defined in: [provenance/types.ts:25](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L25)

## Type Parameters

### State

`State`

### Event

`Event` *extends* `string`

## Properties

### annotations

> **annotations**: `object`

Defined in: [provenance/types.ts:57](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L57)

#### add()

> **add**(`annotation`, `node?`): `void`

##### Parameters

###### annotation

`string`

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`void`

#### all()

> **all**(`node?`): `string`[] \| `undefined`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`string`[] \| `undefined`

#### latest()

> **latest**(`node?`): `string` \| `undefined`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`string` \| `undefined`

***

### artifact

> **artifact**: `object`

Defined in: [provenance/types.ts:52](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L52)

#### add()

> **add**\<`A`\>(`artifact`, `node?`): `void`

##### Type Parameters

###### A

`A`

##### Parameters

###### artifact

`A`

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`void`

#### all()

> **all**(`node?`): [`Artifact`](../type-aliases/Artifact)[] \| `undefined`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

[`Artifact`](../type-aliases/Artifact)[] \| `undefined`

#### latest()

> **latest**(`node?`): [`Artifact`](../type-aliases/Artifact) \| `undefined`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

[`Artifact`](../type-aliases/Artifact) \| `undefined`

***

### bookmarks

> **bookmarks**: `object`

Defined in: [provenance/types.ts:62](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L62)

#### add()

> **add**(`node?`): `void`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`void`

#### is()

> **is**(`node?`): `boolean`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`boolean`

#### remove()

> **remove**(`node?`): `void`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`void`

#### toggle()

> **toggle**(`node?`): `void`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`void`

***

### current

> **current**: [`ProvenanceNode`](../type-aliases/ProvenanceNode)\<`State`, `Event`\>

Defined in: [provenance/types.ts:30](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L30)

***

### graph

> **graph**: [`ProvenanceGraphStore`](../type-aliases/ProvenanceGraphStore)\<`State`, `Event`\>

Defined in: [provenance/types.ts:29](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L29)

***

### isTraversing

> **isTraversing**: `boolean`

Defined in: [provenance/types.ts:27](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L27)

***

### metadata

> **metadata**: `object`

Defined in: [provenance/types.ts:38](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L38)

#### add()

> **add**(`metadata`, `node?`): `void`

##### Parameters

###### metadata

`Record`\<`string`, `unknown`\>

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`void`

#### all()

> **all**(`node?`): `Record`\<`string`, [`Metadata`](../type-aliases/Metadata)[]\> \| `undefined`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`Record`\<`string`, [`Metadata`](../type-aliases/Metadata)[]\> \| `undefined`

#### allOfType()

> **allOfType**\<`T`\>(`type`, `node?`): [`Metadata`](../type-aliases/Metadata)\<`T`\>[] \| `undefined`

##### Type Parameters

###### T

`T` = `unknown`

##### Parameters

###### type

`string`

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

[`Metadata`](../type-aliases/Metadata)\<`T`\>[] \| `undefined`

#### latest()

> **latest**(`node?`): `Record`\<`string`, [`Metadata`](../type-aliases/Metadata)\> \| `undefined`

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`Record`\<`string`, [`Metadata`](../type-aliases/Metadata)\> \| `undefined`

#### latestOfType()

> **latestOfType**\<`T`\>(`type`, `node?`): [`Metadata`](../type-aliases/Metadata)\<`T`\> \| `undefined`

##### Type Parameters

###### T

`T` = `unknown`

##### Parameters

###### type

`string`

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

[`Metadata`](../type-aliases/Metadata)\<`T`\> \| `undefined`

#### types()

> **types**(`node?`): `string`[]

##### Parameters

###### node?

[`NodeId`](../type-aliases/NodeId)

##### Returns

`string`[]

***

### registry

> **registry**: [`Registry`](../classes/Registry)\<`Event`\>

Defined in: [provenance/types.ts:26](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L26)

***

### root

> **root**: [`RootNode`](../type-aliases/RootNode)\<`State`\>

Defined in: [provenance/types.ts:31](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L31)

## Methods

### apply()

> **apply**\<`T`, `Payload`\>(`label`, `act`): `Promise`\<`void`\>

Defined in: [provenance/types.ts:33](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L33)

#### Type Parameters

##### T

`T` *extends* `string`

##### Payload

`Payload` = `unknown`

#### Parameters

##### label

`string`

##### act

###### payload

`Payload`

###### type

`T`

#### Returns

`Promise`\<`void`\>

***

### currentChange()

> **currentChange**(`listener`, `skipOnNew?`): [`UnsubscribeCurrentChangeListener`](../type-aliases/UnsubscribeCurrentChangeListener)

Defined in: [provenance/types.ts:70](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L70)

#### Parameters

##### listener

[`CurrentChangeHandler`](../type-aliases/CurrentChangeHandler)

##### skipOnNew?

`boolean`

#### Returns

[`UnsubscribeCurrentChangeListener`](../type-aliases/UnsubscribeCurrentChangeListener)

***

### done()

> **done**(): `void`

Defined in: [provenance/types.ts:74](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L74)

#### Returns

`void`

***

### export()

> **export**(): `string`

Defined in: [provenance/types.ts:77](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L77)

#### Returns

`string`

***

### exportObject()

> **exportObject**(): `ProvenanceGraph`\<`State`, `Event`\>

Defined in: [provenance/types.ts:78](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L78)

#### Returns

`ProvenanceGraph`\<`State`, `Event`\>

***

### getState()

> **getState**(`node?`): `State`

Defined in: [provenance/types.ts:28](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L28)

#### Parameters

##### node?

[`ProvenanceNode`](../type-aliases/ProvenanceNode)\<`State`, `Event`\>

#### Returns

`State`

***

### import()

> **import**(`graphString`): `void`

Defined in: [provenance/types.ts:79](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L79)

#### Parameters

##### graphString

`string`

#### Returns

`void`

***

### importObject()

> **importObject**(`graph`): `void`

Defined in: [provenance/types.ts:80](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L80)

#### Parameters

##### graph

`ProvenanceGraph`\<`State`, `Event`\>

#### Returns

`void`

***

### on()

> **on**(`event`, `listener`): `void`

Defined in: [provenance/types.ts:76](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L76)

#### Parameters

##### event

[`TrrackEvents`](../enumerations/TrrackEvents)

##### listener

(`args?`) => `void`

#### Returns

`void`

***

### record()

> **record**(`args`): `void`

Defined in: [provenance/types.ts:32](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L32)

#### Parameters

##### args

[`RecordActionArgs`](../type-aliases/RecordActionArgs)\<`State`, `Event`\>

#### Returns

`void`

***

### redo()

> **redo**(`to?`): `Promise`\<`void`\>

Defined in: [provenance/types.ts:69](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L69)

#### Parameters

##### to?

`"latest"` | `"oldest"`

#### Returns

`Promise`\<`void`\>

***

### to()

> **to**(`node`): `Promise`\<`void`\>

Defined in: [provenance/types.ts:37](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L37)

#### Parameters

##### node

[`NodeId`](../type-aliases/NodeId)

#### Returns

`Promise`\<`void`\>

***

### tree()

> **tree**(): `unknown`

Defined in: [provenance/types.ts:75](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L75)

#### Returns

`unknown`

***

### undo()

> **undo**(): `Promise`\<`void`\>

Defined in: [provenance/types.ts:68](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/provenance/types.ts#L68)

#### Returns

`Promise`\<`void`\>
