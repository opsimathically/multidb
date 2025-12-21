[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDB

# Class: MariaDB

Defined in: [src/classes/mariadb/MariaDB.class.ts:133](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L133)

## Constructors

### Constructor

> **new MariaDB**(): `MariaDB`

Defined in: [src/classes/mariadb/MariaDB.class.ts:137](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L137)

#### Returns

`MariaDB`

## Properties

### admin\_pools

> **admin\_pools**: `Record`\<`string`, `Pool`\> = `{}`

Defined in: [src/classes/mariadb/MariaDB.class.ts:135](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L135)

***

### connection\_pools

> **connection\_pools**: `Record`\<`string`, [`MariaDBPool`](MariaDBPool.md)\> = `{}`

Defined in: [src/classes/mariadb/MariaDB.class.ts:134](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L134)

## Methods

### addAdminPool()

> **addAdminPool**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:143](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L143)

#### Parameters

##### params

###### name

`string`

###### pool_options

`PoolOptions`

#### Returns

`Promise`\<`boolean`\>

***

### addPool()

> **addPool**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:154](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L154)

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

Defined in: [src/classes/mariadb/MariaDB.class.ts:203](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L203)

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

#### Returns

`Promise`\<[`MariaDBQueryTemplate`](MariaDBQueryTemplate.md)\<`query_args_g`, `result_row_g`\> \| `null`\>

***

### createDatabaseIfNotExists()

> **createDatabaseIfNotExists**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:306](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L306)

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

Defined in: [src/classes/mariadb/MariaDB.class.ts:396](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L396)

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

Defined in: [src/classes/mariadb/MariaDB.class.ts:344](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L344)

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

Defined in: [src/classes/mariadb/MariaDB.class.ts:269](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L269)

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

Defined in: [src/classes/mariadb/MariaDB.class.ts:419](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L419)

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

Defined in: [src/classes/mariadb/MariaDB.class.ts:261](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L261)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### tableExists()

> **tableExists**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mariadb/MariaDB.class.ts:366](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDB.class.ts#L366)

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
