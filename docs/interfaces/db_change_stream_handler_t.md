[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / db\_change\_stream\_handler\_t

# Interface: db\_change\_stream\_handler\_t\<TDoc\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:50](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L50)

## Type Parameters

### TDoc

`TDoc` *extends* `Document` = `Document`

## Properties

### change\_stream

> **change\_stream**: `ChangeStream`\<`Document`, `ChangeStreamDocument`\<`Document`\>\> \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:53](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L53)

***

### db

> **db**: `string` \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:52](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L52)

***

### mongodb\_ref

> **mongodb\_ref**: [`MongoDB`](../classes/MongoDB.md) \| `undefined`

Defined in: [src/classes/mongodb/MongoDB.class.ts:51](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L51)

***

### onChange()

> **onChange**: (`change`) => `void` \| `Promise`\<`void`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:57](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mongodb/MongoDB.class.ts#L57)

#### Parameters

##### change

`ChangeStreamDocument`\<`TDoc`\>

#### Returns

`void` \| `Promise`\<`void`\>
