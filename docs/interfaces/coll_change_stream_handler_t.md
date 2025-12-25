[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / coll\_change\_stream\_handler\_t

# Interface: coll\_change\_stream\_handler\_t\<TDoc\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:37](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L37)

## Type Parameters

### TDoc

`TDoc` *extends* `Document` = `Document`

## Properties

### change\_stream

> **change\_stream**: `ChangeStream`\<`Document`, `ChangeStreamDocument`\<`Document`\>\> \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:43](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L43)

***

### collection

> **collection**: `string` \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:42](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L42)

***

### db

> **db**: `string` \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:41](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L41)

***

### mongodb\_ref

> **mongodb\_ref**: [`MongoDB`](../classes/MongoDB.md) \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:40](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L40)

***

### onChange()

> **onChange**: (`change`) => `void` \| `Promise`\<`void`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:47](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L47)

#### Parameters

##### change

`ChangeStreamDocument`\<`TDoc`\>

#### Returns

`void` \| `Promise`\<`void`\>
