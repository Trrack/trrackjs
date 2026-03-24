[**@trrack/core**](../README)

***

[@trrack/core](../README) / Registry

# Class: Registry\<Event\>

Defined in: [registry/reg.ts:26](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L26)

## Type Parameters

### Event

`Event` *extends* `string`

## Methods

### get()

> **get**(`type`): `TrrackActionRegisteredObject`

Defined in: [registry/reg.ts:135](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L135)

#### Parameters

##### type

`string`

#### Returns

`TrrackActionRegisteredObject`

***

### has()

> **has**(`name`): `boolean`

Defined in: [registry/reg.ts:37](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L37)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### register()

#### Call Signature

> **register**\<`DoActionType`, `State`, `DoActionPayload`\>(`type`, `actionFunction`, `config?`): `IsAny`\<`DoActionPayload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `DoActionType`\>\>

Defined in: [registry/reg.ts:41](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L41)

##### Type Parameters

###### DoActionType

`DoActionType` *extends* `string`

###### State

`State` = `any`

###### DoActionPayload

`DoActionPayload` = `any`

##### Parameters

###### type

`DoActionType`

###### actionFunction

[`StateChangeFunction`](../type-aliases/StateChangeFunction)\<`State`, `DoActionPayload`\>

###### config?

###### eventType

`Event`

###### label

`string` \| [`LabelGenerator`](../type-aliases/LabelGenerator)\<`DoActionPayload`\>

##### Returns

`IsAny`\<`DoActionPayload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `DoActionType`\>\>

#### Call Signature

> **register**\<`DoActionType`, `UndoActionType`, `DoActionPayload`, `UndoActionPayload`\>(`type`, `actionFunction`, `config?`): `IsAny`\<`DoActionPayload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `DoActionType`\>\>

Defined in: [registry/reg.ts:53](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L53)

##### Type Parameters

###### DoActionType

`DoActionType` *extends* `string`

###### UndoActionType

`UndoActionType` *extends* `string`

###### DoActionPayload

`DoActionPayload` = `any`

###### UndoActionPayload

`UndoActionPayload` = `any`

##### Parameters

###### type

`DoActionType`

###### actionFunction

[`TrrackActionFunction`](../type-aliases/TrrackActionFunction)\<`DoActionType`, `UndoActionType`, `UndoActionPayload`, `DoActionPayload`\>

###### config?

###### eventType

`Event`

###### label

`string` \| [`LabelGenerator`](../type-aliases/LabelGenerator)\<`DoActionPayload`\>

##### Returns

`IsAny`\<`DoActionPayload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `DoActionType`\>\>

#### Call Signature

> **register**\<`DoActionType`, `UndoActionType`, `DoActionPayload`, `UndoActionPayload`, `State`\>(`type`, `actionFunction`, `config?`): `IsAny`\<`DoActionPayload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `DoActionType`\>\>

Defined in: [registry/reg.ts:71](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L71)

##### Type Parameters

###### DoActionType

`DoActionType` *extends* `string`

###### UndoActionType

`UndoActionType` *extends* `string`

###### DoActionPayload

`DoActionPayload` = `any`

###### UndoActionPayload

`UndoActionPayload` = `any`

###### State

`State` = `any`

##### Parameters

###### type

`DoActionType`

###### actionFunction

[`TrrackActionFunction`](../type-aliases/TrrackActionFunction)\<`DoActionType`, `UndoActionType`, `UndoActionPayload`, `DoActionPayload`\> | [`StateChangeFunction`](../type-aliases/StateChangeFunction)\<`State`, `DoActionPayload`\>

###### config?

###### eventType

`Event`

###### label

`string` \| [`LabelGenerator`](../type-aliases/LabelGenerator)\<`DoActionPayload`\>

##### Returns

`IsAny`\<`DoActionPayload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `DoActionType`\>\>

***

### create()

> `static` **create**\<`Event`\>(): `Registry`\<`Event`\>

Defined in: [registry/reg.ts:27](https://github.com/Trrack/trrackjs/blob/3e986969bcd5ec383c070c117e840536bee9796d/packages/core/src/registry/reg.ts#L27)

#### Type Parameters

##### Event

`Event` *extends* `string`

#### Returns

`Registry`\<`Event`\>
