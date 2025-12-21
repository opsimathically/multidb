[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBQueryTemplate

# Class: MariaDBQueryTemplate\<query_args_g, result_row_g\>

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:6](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L6)

## Type Parameters

### query_args_g

`query_args_g`

### result_row_g

`result_row_g`

## Constructors

### Constructor

> **new MariaDBQueryTemplate**\<`query_args_g`, `result_row_g`\>(`params`): `MariaDBQueryTemplate`\<`query_args_g`, `result_row_g`\>

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:11](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L11)

#### Parameters

##### params

###### db

`string`

###### pool

[`MariaDBPool`](MariaDBPool.md)

###### query

`string`

###### sha1

`string`

#### Returns

`MariaDBQueryTemplate`\<`query_args_g`, `result_row_g`\>

## Properties

### db

> **db**: `string`

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:8](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L8)

***

### pool

> **pool**: [`MariaDBPool`](MariaDBPool.md)

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:9](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L9)

***

### query

> **query**: `string`

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:7](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L7)

***

### sha1

> **sha1**: `string`

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:10](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L10)

## Methods

### execute()

> **execute**(`params?`): `Promise`\<`result_row_g`[] \| `null`\>

Defined in: [src/classes/mariadb/MariaDBQueryTemplate.class.ts:23](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBQueryTemplate.class.ts#L23)

#### Parameters

##### params?

###### args?

`query_args_g`

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"`\>

#### Returns

`Promise`\<`result_row_g`[] \| `null`\>
