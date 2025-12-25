[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBStackedQueryTemplate

# Class: MariaDBStackedQueryTemplate\<query_args_g, result_row_g\>

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:3](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L3)

## Type Parameters

### query_args_g

`query_args_g`

### result_row_g

`result_row_g`

## Constructors

### Constructor

> **new MariaDBStackedQueryTemplate**\<`query_args_g`, `result_row_g`\>(`params`): `MariaDBStackedQueryTemplate`\<`query_args_g`, `result_row_g`\>

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:14](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L14)

#### Parameters

##### params

###### db

`string`

###### expected_value_set_count

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

`MariaDBStackedQueryTemplate`\<`query_args_g`, `result_row_g`\>

## Properties

### db

> **db**: `string`

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:10](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L10)

***

### expected\_value\_set\_count

> **expected\_value\_set\_count**: `number`

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:9](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L9)

***

### pool

> **pool**: [`MariaDBPool`](MariaDBPool.md)

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:11](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L11)

***

### query\_insert\_and\_columns

> **query\_insert\_and\_columns**: `string`

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:5](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L5)

***

### sha1

> **sha1**: `string`

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:12](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L12)

***

### trailing\_clause?

> `optional` **trailing\_clause**: `string`

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:7](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L7)

## Methods

### execute()

> **execute**(`params?`): `Promise`\<`result_row_g`[] \| `null`\>

Defined in: [src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts:30](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBStackedQueryTemplate.class.ts#L30)

#### Parameters

##### params?

###### args_array?

`query_args_g`[]

#### Returns

`Promise`\<`result_row_g`[] \| `null`\>
