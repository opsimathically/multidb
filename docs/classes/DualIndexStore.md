[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / DualIndexStore

# Class: DualIndexStore\<T\>

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:9](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L9)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new DualIndexStore**\<`T`\>(): `DualIndexStore`\<`T`\>

#### Returns

`DualIndexStore`\<`T`\>

## Methods

### addName()

> **addName**(`hash`, `name`): `void`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:37](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L37)

#### Parameters

##### hash

`string`

##### name

`string`

#### Returns

`void`

***

### deleteHash()

> **deleteHash**(`hash`): `boolean`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:71](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L71)

#### Parameters

##### hash

`string`

#### Returns

`boolean`

***

### deleteName()

> **deleteName**(`name`): `boolean`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:57](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L57)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### getByHash()

> **getByHash**(`hash`): `T` \| `undefined`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:22](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L22)

#### Parameters

##### hash

`string`

#### Returns

`T` \| `undefined`

***

### getByName()

> **getByName**(`name`): `T` \| `undefined`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:26](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L26)

#### Parameters

##### name

`string`

#### Returns

`T` \| `undefined`

***

### hasHash()

> **hasHash**(`hash`): `boolean`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:14](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L14)

#### Parameters

##### hash

`string`

#### Returns

`boolean`

***

### hasName()

> **hasName**(`name`): `boolean`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:18](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L18)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### listNames()

> **listNames**(`hash`): `string`[]

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:93](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L93)

#### Parameters

##### hash

`string`

#### Returns

`string`[]

***

### rename()

> **rename**(`oldName`, `newName`): `void`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:83](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L83)

#### Parameters

##### oldName

`string`

##### newName

`string`

#### Returns

`void`

***

### set()

> **set**(`hash`, `value`, `names`): `void`

Defined in: [src/classes/dualstore/DualIndexStore.class.ts:32](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/dualstore/DualIndexStore.class.ts#L32)

#### Parameters

##### hash

`string`

##### value

`T`

##### names

`string`[] = `[]`

#### Returns

`void`
