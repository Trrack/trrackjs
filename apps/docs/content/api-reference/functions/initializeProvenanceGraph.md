[**@trrack/core**](../README)

***

[@trrack/core](../README) / initializeProvenanceGraph

# Function: initializeProvenanceGraph()

> **initializeProvenanceGraph**\<`State`, `Event`\>(`initialState`): `object`

Defined in: [graph/provenance-graph.ts:23](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/graph/provenance-graph.ts#L23)

## Type Parameters

### State

`State`

### Event

`Event` *extends* `string`

## Parameters

### initialState

`State`

## Returns

`object`

### addArtifact

> **addArtifact**: [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`AddArtifactPayload`, `"provenance-graph/addArtifact"`\>

### addMetadata

> **addMetadata**: [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`AddMetadataPayload`, `"provenance-graph/addMetadata"`\>

### addNode

> **addNode**: [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<[`StateNode`](../type-aliases/StateNode)\<`State`, `Event`\>, `"provenance-graph/addNode"`\>

### backend

> **backend**: `ProvenanceGraph`\<`State`, `Event`\>

### changeCurrent

> **changeCurrent**: [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<[`NodeId`](../type-aliases/NodeId), `"provenance-graph/changeCurrent"`\>

### current

> **current**: [`ProvenanceNode`](../type-aliases/ProvenanceNode)\<`State`, `Event`\>

### initialState

> **initialState**: `ProvenanceGraph`\<`State`, `Event`\>

### load

> **load**: [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`ProvenanceGraph`\<`State`, `Event`\>, `"provenance-graph/load"`\>

### root

> **root**: [`RootNode`](../type-aliases/RootNode)\<`State`\>

### update()

> **update**: (`action`) => \{ `payload`: `AddMetadataPayload`; `type`: `"provenance-graph/addMetadata"`; \} \| \{ `payload`: `AddArtifactPayload`; `type`: `"provenance-graph/addArtifact"`; \} \| \{ `payload`: [`NodeId`](../type-aliases/NodeId); `type`: `"provenance-graph/changeCurrent"`; \} \| \{ `payload`: [`StateNode`](../type-aliases/StateNode); `type`: `"provenance-graph/addNode"`; \} \| \{ `payload`: `ProvenanceGraph`; `type`: `"provenance-graph/load"`; \}

#### Parameters

##### action

`ProvenanceGraphAction`\<`State`, `Event`\>

#### Returns

\{ `payload`: `AddMetadataPayload`; `type`: `"provenance-graph/addMetadata"`; \} \| \{ `payload`: `AddArtifactPayload`; `type`: `"provenance-graph/addArtifact"`; \} \| \{ `payload`: [`NodeId`](../type-aliases/NodeId); `type`: `"provenance-graph/changeCurrent"`; \} \| \{ `payload`: [`StateNode`](../type-aliases/StateNode); `type`: `"provenance-graph/addNode"`; \} \| \{ `payload`: `ProvenanceGraph`; `type`: `"provenance-graph/load"`; \}

### currentChange()

> **currentChange**(`func`, `config`): [`UnsubscribeCurrentChangeListener`](../type-aliases/UnsubscribeCurrentChangeListener)

#### Parameters

##### func

[`CurrentChangeHandler`](../type-aliases/CurrentChangeHandler)

##### config

[`CurrentChangeHandlerConfig`](../type-aliases/CurrentChangeHandlerConfig)

#### Returns

[`UnsubscribeCurrentChangeListener`](../type-aliases/UnsubscribeCurrentChangeListener)
