[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDB

# Class: MariaDB

Defined in: [src/classes/mariadb/MariaDB.class.ts:143](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L143)

## Constructors

### Constructor

> **new MariaDB**(): `MariaDB`

Defined in: [src/classes/mariadb/MariaDB.class.ts:147](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L147)

#### Returns

`MariaDB`

## Properties

### admin\_pools

> **admin\_pools**: `Record`\<`string`, `Pool`\> = `{}`

Defined in: [src/classes/mariadb/MariaDB.class.ts:145](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L145)

***

### connection\_pools

> **connection\_pools**: `Record`\<`string`, [`MariaDBPool`](MariaDBPool.md)\> = `{}`

Defined in: [src/classes/mariadb/MariaDB.class.ts:144](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L144)

## Methods

### addAdminPool()

> **addAdminPool**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:153](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L153)

#### Parameters

##### params

###### name

`string`

###### pool_options

`PoolOptions`

#### Returns

`Promise`\<`boolean`\>

***

### addBufferedStackedInsertQuery()

> **addBufferedStackedInsertQuery**\<`query_args_g`\>(`params`): `Promise`\<[`MariaDBBufferedStackedQueryTemplate`](MariaDBBufferedStackedQueryTemplate.md)\<`query_args_g`, `ResultSetHeader`\> \| `null`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:364](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L364)

#### Type Parameters

##### query_args_g

`query_args_g`

#### Parameters

##### params

###### db

`string`

###### expected_value_set_count

`number`

###### max_rows_before_insert_len

`number`

###### max_timeout_for_insert_when_no_new_records_ms

`number`

###### name

`string`

###### pool

`string`

###### query_insert_and_columns

`string`

###### skip_validator?

`boolean`

###### trailing_clause?

`string`

#### Returns

`Promise`\<[`MariaDBBufferedStackedQueryTemplate`](MariaDBBufferedStackedQueryTemplate.md)\<`query_args_g`, `ResultSetHeader`\> \| `null`\>

***

### addPool()

> **addPool**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:165](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L165)

#### Parameters

##### params

###### db

`string`

###### name

`string`

###### pool_options

`PoolOptions`

#### Returns

`Promise`\<`boolean`\>

***

### addQuery()

> **addQuery**\<`query_args_g`, `result_row_g`\>(`params`): `Promise`\<[`MariaDBQueryTemplate`](MariaDBQueryTemplate.md)\<`query_args_g`, `result_row_g`\> \| `null`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:449](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L449)

#### Type Parameters

##### query_args_g

`query_args_g`

##### result_row_g

`result_row_g`

#### Parameters

##### params

###### db

`string`

###### name

`string`

###### pool

`string`

###### query

`string`

###### skip_validator?

`boolean`

#### Returns

`Promise`\<[`MariaDBQueryTemplate`](MariaDBQueryTemplate.md)\<`query_args_g`, `result_row_g`\> \| `null`\>

***

### addStackedInsertQuery()

> **addStackedInsertQuery**\<`query_args_g`\>(`params`): `Promise`\<[`MariaDBStackedQueryTemplate`](MariaDBStackedQueryTemplate.md)\<`query_args_g`, `ResultSetHeader`\> \| `null`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:251](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L251)

#### Type Parameters

##### query_args_g

`query_args_g`

#### Parameters

##### params

###### db

`string`

###### expected_value_set_count

`number`

###### name

`string`

###### pool

`string`

###### query_insert_and_columns

`string`

###### skip_validator?

`boolean`

###### trailing_clause?

`string`

#### Returns

`Promise`\<[`MariaDBStackedQueryTemplate`](MariaDBStackedQueryTemplate.md)\<`query_args_g`, `ResultSetHeader`\> \| `null`\>

***

### createDatabaseIfNotExists()

> **createDatabaseIfNotExists**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:554](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L554)

#### Parameters

##### params

###### adminpool

`string`

###### db

`string`

#### Returns

`Promise`\<`boolean`\>

***

### createTable()

> **createTable**(`params`): `Promise`\<`false` \| `undefined`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:644](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L644)

#### Parameters

##### params

###### db

`string`

###### definition

[`mariadb_table_definition_t`](../type-aliases/mariadb_table_definition_t.md)

###### pool

`string`

#### Returns

`Promise`\<`false` \| `undefined`\>

***

### databaseExists()

> **databaseExists**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:592](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L592)

#### Parameters

##### params

###### db

`string`

###### pool

`string`

#### Returns

`Promise`\<`boolean`\>

***

### dropDatabaseIfExists()

> **dropDatabaseIfExists**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:517](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L517)

#### Parameters

##### params

###### adminpool

`string`

###### db

`string`

#### Returns

`Promise`\<`boolean`\>

***

### generateSelectionQuery()

> **generateSelectionQuery**(`params`): `Promise`\<[`mariadb_selection_query_t`](../type-aliases/mariadb_selection_query_t.md) \| `null`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:667](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L667)

#### Parameters

##### params

###### allowed_columns

`string`[]

###### allowed_compares

`string`[]

###### allowed_prefixes

`string`[]

###### query_data

[`mariadb_query_data_t`](../type-aliases/mariadb_query_data_t.md)[]

###### selecting_columns

`string`[]

###### table_name

`string`

#### Returns

`Promise`\<[`mariadb_selection_query_t`](../type-aliases/mariadb_selection_query_t.md) \| `null`\>

***

### isValidDatabaseNameString()

> **isValidDatabaseNameString**(`name`): `boolean`

Defined in: [src/classes/mariadb/MariaDB.class.ts:509](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L509)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### shutdown()

> **shutdown**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:211](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L211)

#### Parameters

##### params

###### admin_pools?

`boolean`

###### standard_pools?

`boolean`

#### Returns

`Promise`\<`boolean`\>

***

### tableExists()

> **tableExists**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:614](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDB.class.ts#L614)

#### Parameters

##### params

###### db

`string`

###### pool

`string`

###### table

`string`

#### Returns

`Promise`\<`boolean`\>
