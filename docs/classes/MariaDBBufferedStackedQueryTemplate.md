[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBBufferedStackedQueryTemplate

# Class: MariaDBBufferedStackedQueryTemplate\<query_args_g, result_row_g\>

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:5](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L5)

## Type Parameters

### query_args_g

`query_args_g`

### result_row_g

`result_row_g`

## Constructors

### Constructor

> **new MariaDBBufferedStackedQueryTemplate**\<`query_args_g`, `result_row_g`\>(`params`): `MariaDBBufferedStackedQueryTemplate`\<`query_args_g`, `result_row_g`\>

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:29](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L29)

#### Parameters

##### params

###### db

`string`

###### expected_value_set_count

`number`

###### interval_ms

`number`

###### max_len

`number`

###### pool

[`MariaDBPool`](MariaDBPool.md)

###### query_insert_and_columns

`string`

###### sha1

`string`

###### trailing_clause?

`string`

#### Returns

`MariaDBBufferedStackedQueryTemplate`\<`query_args_g`, `result_row_g`\>

## Properties

### buffered\_array

> **buffered\_array**: [`BufferedArray`](BufferedArray.md)\<`query_args_g`, `MariaDBBufferedStackedQueryTemplate`\<`query_args_g`, `result_row_g`\>\> \| `undefined`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:15](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L15)

***

### db

> **db**: `string`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:12](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L12)

***

### expected\_value\_set\_count

> **expected\_value\_set\_count**: `number`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:11](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L11)

***

### flush\_info

> **flush\_info**: `object`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:21](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L21)

#### last\_flushed\_cnt

> **last\_flushed\_cnt**: `number`

#### total\_flushed\_cnt

> **total\_flushed\_cnt**: `number`

***

### pool

> **pool**: [`MariaDBPool`](MariaDBPool.md)

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:13](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L13)

***

### query\_insert\_and\_columns

> **query\_insert\_and\_columns**: `string`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:7](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L7)

***

### sha1

> **sha1**: `string`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:14](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L14)

***

### trailing\_clause?

> `optional` **trailing\_clause**: `string`

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:9](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L9)

## Methods

### bufferedExecute()

> **bufferedExecute**(`params`): `Promise`\<`result_row_g`[] \| `null`\>

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:64](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L64)

#### Parameters

##### params

###### args_array?

`query_args_g`[]

#### Returns

`Promise`\<`result_row_g`[] \| `null`\>

***

### execute()

> **execute**(`params?`): `Promise`\<`result_row_g`[] \| `null`\>

Defined in: [src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts:76](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBBufferedStackedQueryTemplate.class.ts#L76)

#### Parameters

##### params?

###### args_array?

`query_args_g`[]

#### Returns

`Promise`\<`result_row_g`[] \| `null`\>
