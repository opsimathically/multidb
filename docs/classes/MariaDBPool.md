[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBPool

# Class: MariaDBPool

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:14](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L14)

## Constructors

### Constructor

> **new MariaDBPool**(`params`): `MariaDBPool`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:27](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L27)

#### Parameters

##### params

###### db

`string`

###### name

`string`

###### pool

`Pool`

###### pool_options

`PoolOptions`

###### query_validator

[`MariaDBSQLQueryValidator`](MariaDBSQLQueryValidator.md)

###### schema_introspector

[`MariaDBDatabaseSchemaIntrospector`](MariaDBDatabaseSchemaIntrospector.md)

###### schema_snapshot

[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)

###### sync_pool

`Pool`

#### Returns

`MariaDBPool`

## Properties

### db

> **db**: `string`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:16](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L16)

***

### name

> **name**: `string`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:15](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L15)

***

### pool

> **pool**: `Pool`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:17](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L17)

***

### pool\_options

> **pool\_options**: `PoolOptions`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:19](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L19)

***

### query\_templates

> **query\_templates**: `DualIndexStore`\<[`MariaDBQueryTemplate`](MariaDBQueryTemplate.md)\<`unknown`, `unknown`\>\>

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:24](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L24)

***

### query\_validator

> **query\_validator**: [`MariaDBSQLQueryValidator`](MariaDBSQLQueryValidator.md)

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:21](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L21)

***

### schema\_introspector

> **schema\_introspector**: [`MariaDBDatabaseSchemaIntrospector`](MariaDBDatabaseSchemaIntrospector.md)

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:20](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L20)

***

### schema\_snapshot

> **schema\_snapshot**: [`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:22](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L22)

***

### sync\_pool

> **sync\_pool**: `Pool`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:18](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBPool.class.ts#L18)
