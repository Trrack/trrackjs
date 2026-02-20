[@trrack/core](../index) / Trrack

# Interface: Trrack\<State, Event\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `State` | `State` |
| `Event` | extends `string` |

## Table of contents

### Properties

- [annotations](Trrack#annotations)
- [artifact](Trrack#artifact)
- [bookmarks](Trrack#bookmarks)
- [current](Trrack#current)
- [graph](Trrack#graph)
- [isTraversing](Trrack#istraversing)
- [metadata](Trrack#metadata)
- [registry](Trrack#registry)
- [root](Trrack#root)

### Methods

- [apply](Trrack#apply)
- [currentChange](Trrack#currentchange)
- [done](Trrack#done)
- [export](Trrack#export)
- [exportObject](Trrack#exportobject)
- [getState](Trrack#getstate)
- [import](Trrack#import)
- [importObject](Trrack#importobject)
- [on](Trrack#on)
- [record](Trrack#record)
- [redo](Trrack#redo)
- [to](Trrack#to)
- [tree](Trrack#tree)
- [undo](Trrack#undo)

## Properties

### annotations

• **annotations**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | (`annotation`: `string`, `node?`: [`NodeId`](../types/NodeId)) => `void` |
| `all` | (`node?`: [`NodeId`](../types/NodeId)) => `undefined` \| `string`[] |
| `latest` | (`node?`: [`NodeId`](../types/NodeId)) => `undefined` \| `string` |

#### Defined in

[packages/core/src/provenance/types.ts:57](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L57)

___

### artifact

• **artifact**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | \<A\>(`artifact`: `A`, `node?`: [`NodeId`](../types/NodeId)) => `void` |
| `all` | (`node?`: [`NodeId`](../types/NodeId)) => `undefined` \| [`Artifact`](../types/Artifact)[] |
| `latest` | (`node?`: [`NodeId`](../types/NodeId)) => `undefined` \| [`Artifact`](../types/Artifact) |

#### Defined in

[packages/core/src/provenance/types.ts:52](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L52)

___

### bookmarks

• **bookmarks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | (`node?`: [`NodeId`](../types/NodeId)) => `void` |
| `is` | (`node?`: [`NodeId`](../types/NodeId)) => `boolean` |
| `remove` | (`node?`: [`NodeId`](../types/NodeId)) => `void` |
| `toggle` | (`node?`: [`NodeId`](../types/NodeId)) => `void` |

#### Defined in

[packages/core/src/provenance/types.ts:62](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L62)

___

### current

• **current**: [`ProvenanceNode`](../types/ProvenanceNode)\<`State`, `Event`\>

#### Defined in

[packages/core/src/provenance/types.ts:30](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L30)

___

### graph

• **graph**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `backend` | `ProvenanceGraph`\<`any`, `any`\> |
| `current` | [`ProvenanceNode`](../types/ProvenanceNode)\<`any`, `any`\> |
| `initialState` | `ProvenanceGraph`\<`any`, `any`\> |
| `root` | [`RootNode`](../types/RootNode)\<`any`\> |
| `update` | (`action`: `Action`\<``"listenerMiddleware/add"``\>) => `UnsubscribeListener` & `ThunkDispatch`\<`ProvenanceGraph`\<`any`, `any`\>, `undefined`, `AnyAction`\> & `Dispatch`\<`AnyAction`\> |
| `addArtifact` | (`payload`: `AddArtifactPayload`) => \{ `payload`: `AddArtifactPayload` ; `type`: ``"provenance-graph/addArtifact"``  } |
| `addMetadata` | (`payload`: `AddMetadataPayload`) => \{ `payload`: `AddMetadataPayload` ; `type`: ``"provenance-graph/addMetadata"``  } |
| `addNode` | (`payload`: [`StateNode`](../types/StateNode)\<`any`, `any`\>) => \{ `payload`: [`StateNode`](../types/StateNode)\<`any`, `any`\> ; `type`: ``"provenance-graph/addNode"``  } |
| `changeCurrent` | (`payload`: [`NodeId`](../types/NodeId)) => \{ `payload`: [`NodeId`](../types/NodeId) ; `type`: ``"provenance-graph/changeCurrent"``  } |
| `currentChange` | (`func`: [`CurrentChangeHandler`](../types/CurrentChangeHandler), `config`: [`CurrentChangeHandlerConfig`](../types/CurrentChangeHandlerConfig)) => [`UnsubscribeCurrentChangeListener`](../types/UnsubscribeCurrentChangeListener) |
| `load` | (`payload`: `ProvenanceGraph`\<`any`, `any`\>) => \{ `payload`: `ProvenanceGraph`\<`any`, `any`\> ; `type`: ``"provenance-graph/load"``  } |

#### Defined in

[packages/core/src/provenance/types.ts:29](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L29)

___

### isTraversing

• **isTraversing**: `boolean`

#### Defined in

[packages/core/src/provenance/types.ts:27](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L27)

___

### metadata

• **metadata**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | (`metadata`: `Record`\<`string`, `unknown`\>, `node?`: [`NodeId`](../types/NodeId)) => `void` |
| `all` | (`node?`: [`NodeId`](../types/NodeId)) => `undefined` \| `Record`\<`string`, [`Metadata`](../types/Metadata)\<`unknown`\>[]\> |
| `allOfType` | \<T\>(`type`: `string`, `node?`: [`NodeId`](../types/NodeId)) => `undefined` \| [`Metadata`](../types/Metadata)\<`T`\>[] |
| `latest` | (`node?`: [`NodeId`](../types/NodeId)) => `undefined` \| `Record`\<`string`, [`Metadata`](../types/Metadata)\<`unknown`\>\> |
| `latestOfType` | \<T\>(`type`: `string`, `node?`: [`NodeId`](../types/NodeId)) => `undefined` \| [`Metadata`](../types/Metadata)\<`T`\> |
| `types` | (`node?`: [`NodeId`](../types/NodeId)) => `string`[] |

#### Defined in

[packages/core/src/provenance/types.ts:38](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L38)

___

### registry

• **registry**: [`Registry`](../classes/Registry)\<`Event`\>

#### Defined in

[packages/core/src/provenance/types.ts:26](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L26)

___

### root

• **root**: [`RootNode`](../types/RootNode)\<`State`\>

#### Defined in

[packages/core/src/provenance/types.ts:31](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L31)

## Methods

### apply

▸ **apply**\<`T`, `Payload`\>(`label`, `act`): `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |
| `Payload` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `act` | `Object` |
| `act.payload` | `Payload` |
| `act.type` | `T` |

#### Returns

`any`

#### Defined in

[packages/core/src/provenance/types.ts:33](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L33)

___

### currentChange

▸ **currentChange**(`listener`, `skipOnNew?`): [`UnsubscribeCurrentChangeListener`](../types/UnsubscribeCurrentChangeListener)

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | [`CurrentChangeHandler`](../types/CurrentChangeHandler) |
| `skipOnNew?` | `boolean` |

#### Returns

[`UnsubscribeCurrentChangeListener`](../types/UnsubscribeCurrentChangeListener)

#### Defined in

[packages/core/src/provenance/types.ts:70](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L70)

___

### done

▸ **done**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/provenance/types.ts:74](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L74)

___

### export

▸ **export**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/provenance/types.ts:77](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L77)

___

### exportObject

▸ **exportObject**(): `ProvenanceGraph`\<`State`, `Event`\>

#### Returns

`ProvenanceGraph`\<`State`, `Event`\>

#### Defined in

[packages/core/src/provenance/types.ts:78](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L78)

___

### getState

▸ **getState**(`node?`): `State`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node?` | [`ProvenanceNode`](../types/ProvenanceNode)\<`State`, `Event`\> |

#### Returns

`State`

#### Defined in

[packages/core/src/provenance/types.ts:28](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L28)

___

### import

▸ **import**(`graphString`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `graphString` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/provenance/types.ts:79](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L79)

___

### importObject

▸ **importObject**(`graph`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `graph` | `ProvenanceGraph`\<`State`, `Event`\> |

#### Returns

`void`

#### Defined in

[packages/core/src/provenance/types.ts:80](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L80)

___

### on

▸ **on**(`event`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`TrrackEvents`](../enums/TrrackEvents) |
| `listener` | (`args?`: `any`) => `void` |

#### Returns

`void`

#### Defined in

[packages/core/src/provenance/types.ts:76](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L76)

___

### record

▸ **record**(`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`RecordActionArgs`](../types/RecordActionArgs)\<`State`, `Event`\> |

#### Returns

`void`

#### Defined in

[packages/core/src/provenance/types.ts:32](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L32)

___

### redo

▸ **redo**(`to?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `to?` | ``"latest"`` \| ``"oldest"`` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/provenance/types.ts:69](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L69)

___

### to

▸ **to**(`node`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`NodeId`](../types/NodeId) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/provenance/types.ts:37](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L37)

___

### tree

▸ **tree**(): `any`

#### Returns

`any`

#### Defined in

[packages/core/src/provenance/types.ts:75](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L75)

___

### undo

▸ **undo**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/provenance/types.ts:68](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/provenance/types.ts#L68)
