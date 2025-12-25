[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBPool

# Class: MariaDBPool

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:17](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L17)

## Constructors

### Constructor

> **new MariaDBPool**(`params`): `MariaDBPool`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:40](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L40)

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

### buffered\_stacked\_query\_templates

> **buffered\_stacked\_query\_templates**: `DualIndexStore`\<`MariaDBBufferedStackedQueryTemplate`\<`unknown`, `unknown`\>\>

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:34](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L34)

***

### db

> **db**: `string`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:19](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L19)

***

### name

> **name**: `string`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:18](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L18)

***

### pool

> **pool**: `Pool`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:20](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L20)

***

### pool\_options

> **pool\_options**: `PoolOptions`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:22](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L22)

***

### query\_templates

> **query\_templates**: `DualIndexStore`\<[`MariaDBQueryTemplate`](MariaDBQueryTemplate.md)\<`unknown`, `unknown`\>\>

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:27](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L27)

***

### query\_validator

> **query\_validator**: [`MariaDBSQLQueryValidator`](MariaDBSQLQueryValidator.md)

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:24](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L24)

***

### schema\_introspector

> **schema\_introspector**: [`MariaDBDatabaseSchemaIntrospector`](MariaDBDatabaseSchemaIntrospector.md)

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:23](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L23)

***

### schema\_snapshot

> **schema\_snapshot**: [`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:25](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L25)

***

### stacked\_query\_templates

> **stacked\_query\_templates**: `DualIndexStore`\<`MariaDBStackedQueryTemplate`\<`unknown`, `unknown`\>\>

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:30](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L30)

***

### sync\_pool

> **sync\_pool**: `Pool`

Defined in: [src/classes/mariadb/MariaDBPool.class.ts:21](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBPool.class.ts#L21)
