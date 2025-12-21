[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBDatabaseSchemaIntrospector

# Class: MariaDBDatabaseSchemaIntrospector

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:217](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L217)

## Constructors

### Constructor

> **new MariaDBDatabaseSchemaIntrospector**(`pool_or_options`, `opts?`): `MariaDBDatabaseSchemaIntrospector`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:222](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L222)

#### Parameters

##### pool\_or\_options

`Pool` | `PoolOptions`

##### opts?

[`introspector_options_t`](../type-aliases/introspector_options_t.md)

#### Returns

`MariaDBDatabaseSchemaIntrospector`

## Methods

### assert\_column\_exists()

> **assert\_column\_exists**(`table_name`, `column_name`): `void`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:533](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L533)

#### Parameters

##### table\_name

`string`

##### column\_name

`string`

#### Returns

`void`

***

### assert\_table\_exists()

> **assert\_table\_exists**(`table_name`): `void`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:524](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L524)

#### Parameters

##### table\_name

`string`

#### Returns

`void`

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:262](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L262)

#### Returns

`Promise`\<`void`\>

***

### get\_snapshot()

> **get\_snapshot**(): [`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:237](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L237)

#### Returns

[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md) \| `null`

***

### get\_table()

> **get\_table**(`table_name`): [`table_schema_t`](../type-aliases/table_schema_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:250](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L250)

#### Parameters

##### table\_name

`string`

#### Returns

[`table_schema_t`](../type-aliases/table_schema_t.md) \| `null`

***

### get\_table\_or\_throw()

> **get\_table\_or\_throw**(`table_name`): [`table_schema_t`](../type-aliases/table_schema_t.md)

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:543](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L543)

#### Parameters

##### table\_name

`string`

#### Returns

[`table_schema_t`](../type-aliases/table_schema_t.md)

***

### get\_view()

> **get\_view**(`view_name`): [`view_schema_t`](../type-aliases/view_schema_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:256](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L256)

#### Parameters

##### view\_name

`string`

#### Returns

[`view_schema_t`](../type-aliases/view_schema_t.md) \| `null`

***

### load\_database\_schema()

> **load\_database\_schema**(`database`): `Promise`\<[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:266](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L266)

#### Parameters

##### database

`string`

#### Returns

`Promise`\<[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)\>

***

### refresh()

> **refresh**(): `Promise`\<[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:519](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L519)

#### Returns

`Promise`\<[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)\>

***

### require\_snapshot()

> **require\_snapshot**(): [`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:241](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L241)

#### Returns

[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)
