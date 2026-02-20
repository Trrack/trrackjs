[@trrack/core](../index) / initializeProvenanceGraph

# Function: initializeProvenanceGraph

▸ **initializeProvenanceGraph**\<`State`, `Event`\>(`initialState`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `State` | `State` |
| `Event` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialState` | `State` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `backend` | `ProvenanceGraph`\<`State`, `Event`\> |
| `current` | [`ProvenanceNode`](../types/ProvenanceNode)\<`State`, `Event`\> |
| `initialState` | `ProvenanceGraph`\<`State`, `Event`\> |
| `root` | [`RootNode`](../types/RootNode)\<`State`\> |
| `update` | (`action`: `Action`\<``"listenerMiddleware/add"``\>) => `UnsubscribeListener` & `ThunkDispatch`\<`ProvenanceGraph`\<`State`, `Event`\>, `undefined`, `AnyAction`\> & `Dispatch`\<`AnyAction`\> |
| `addArtifact` | (`payload`: `AddArtifactPayload`) => \{ `payload`: `AddArtifactPayload` ; `type`: ``"provenance-graph/addArtifact"``  } |
| `addMetadata` | (`payload`: `AddMetadataPayload`) => \{ `payload`: `AddMetadataPayload` ; `type`: ``"provenance-graph/addMetadata"``  } |
| `addNode` | (`payload`: [`StateNode`](../types/StateNode)\<`State`, `Event`\>) => \{ `payload`: [`StateNode`](../types/StateNode)\<`State`, `Event`\> ; `type`: ``"provenance-graph/addNode"``  } |
| `changeCurrent` | (`payload`: [`NodeId`](../types/NodeId)) => \{ `payload`: [`NodeId`](../types/NodeId) ; `type`: ``"provenance-graph/changeCurrent"``  } |
| `currentChange` | (`func`: [`CurrentChangeHandler`](../types/CurrentChangeHandler), `config`: [`CurrentChangeHandlerConfig`](../types/CurrentChangeHandlerConfig)) => [`UnsubscribeCurrentChangeListener`](../types/UnsubscribeCurrentChangeListener) |
| `load` | (`payload`: `ProvenanceGraph`\<`State`, `Event`\>) => \{ `payload`: `ProvenanceGraph`\<`State`, `Event`\> ; `type`: ``"provenance-graph/load"``  } |

#### Defined in

[packages/core/src/graph/provenance-graph.ts:24](https://github.com/Trrack/trrackjs/blob/31af0ead8c2bd805e2cfe296b24b7376892db256/packages/core/src/graph/provenance-graph.ts#L24)
