[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / BufferedArray

# Class: BufferedArray\<T, extra_t\>

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:11](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L11)

## Type Parameters

### T

`T`

### extra_t

`extra_t`

## Constructors

### Constructor

> **new BufferedArray**\<`T`, `extra_t`\>(`params`): `BufferedArray`\<`T`, `extra_t`\>

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:20](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L20)

#### Parameters

##### params

###### config

[`buffered_array_config_i`](../interfaces/buffered_array_config_i.md)

###### extra

`extra_t`

###### flush_callback

[`flush_callback_t`](../type-aliases/flush_callback_t.md)\<`T`, `extra_t`\>

#### Returns

`BufferedArray`\<`T`, `extra_t`\>

## Properties

### extra

> **extra**: `extra_t`

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:18](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L18)

## Methods

### add()

> **add**(`item`): `Promise`\<`void`\>

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:56](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L56)

#### Parameters

##### item

`T`

#### Returns

`Promise`\<`void`\>

***

### addMany()

> **addMany**(`items`): `Promise`\<`void`\>

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:31](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L31)

#### Parameters

##### items

`T`[]

#### Returns

`Promise`\<`void`\>

***

### flushNow()

> **flushNow**(): `Promise`\<`void`\>

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:72](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L72)

#### Returns

`Promise`\<`void`\>

***

### getSize()

> **getSize**(): `number`

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:99](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L99)

#### Returns

`number`

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [src/classes/buffered\_array/BufferedArray.class.ts:93](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/buffered_array/BufferedArray.class.ts#L93)

#### Returns

`Promise`\<`void`\>
