[**@trrack/core**](../index)

***

[@trrack/core](../index) / createAction

# Function: createAction()

## Call Signature

> **createAction**\<`Payload`, `Type`\>(`type`): `IsAny`\<`Payload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `Type`\>\>

Defined in: [action.ts:155](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/action.ts#L155)

### Type Parameters

#### Payload

`Payload` = `void`

#### Type

`Type` *extends* `string` = `string`

### Parameters

#### type

`Type`

### Returns

`IsAny`\<`Payload`, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `Type`\>\>

## Call Signature

> **createAction**\<`Prepare`, `Type`\>(`type`, `prepareAction`): `IfPrepareActionMethodProvided`\<`Prepare`, `_ActionCreatorWithPreparedPayload`\<`Prepare`, `Type`\>, `IsAny`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `Type`\>, `IsUnknown`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithNonInferrablePayload`](../type-aliases/ActionCreatorWithNonInferrablePayload)\<`Type`\>, `IfVoid`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithoutPayload`](../type-aliases/ActionCreatorWithoutPayload)\<`Type`\>, `IfMaybeUndefined`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithOptionalPayload`](../type-aliases/ActionCreatorWithOptionalPayload)\<`ReturnType`\<`Prepare`\>\[`"payload"`\], `Type`\>, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`ReturnType`\<`Prepare`\>\[`"payload"`\], `Type`\>\>\>\>\>\>

Defined in: [action.ts:158](https://github.com/Trrack/trrackjs/blob/521cb97ee128c8f659a2faa17b70af00ddd3b9f3/packages/core/src/action.ts#L158)

### Type Parameters

#### Prepare

`Prepare` *extends* [`PrepareAction`](../type-aliases/PrepareAction)\<`any`\>

#### Type

`Type` *extends* `string` = `string`

### Parameters

#### type

`Type`

#### prepareAction

`Prepare`

### Returns

`IfPrepareActionMethodProvided`\<`Prepare`, `_ActionCreatorWithPreparedPayload`\<`Prepare`, `Type`\>, `IsAny`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`any`, `Type`\>, `IsUnknown`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithNonInferrablePayload`](../type-aliases/ActionCreatorWithNonInferrablePayload)\<`Type`\>, `IfVoid`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithoutPayload`](../type-aliases/ActionCreatorWithoutPayload)\<`Type`\>, `IfMaybeUndefined`\<`ReturnType`\<`Prepare`\>\[`"payload"`\], [`ActionCreatorWithOptionalPayload`](../type-aliases/ActionCreatorWithOptionalPayload)\<`ReturnType`\<`Prepare`\>\[`"payload"`\], `Type`\>, [`ActionCreatorWithPayload`](../type-aliases/ActionCreatorWithPayload)\<`ReturnType`\<`Prepare`\>\[`"payload"`\], `Type`\>\>\>\>\>\>
