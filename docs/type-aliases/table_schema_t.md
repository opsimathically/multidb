[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / table\_schema\_t

# Type Alias: table\_schema\_t

> **table\_schema\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:27](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L27)

## Properties

### check\_constraints

> **check\_constraints**: `Record`\<`string`, [`check_constraint_schema_t`](check_constraint_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:38](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L38)

***

### collation

> **collation**: `string` \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:30](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L30)

***

### columns

> **columns**: `Record`\<`string`, [`column_schema_t`](column_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:33](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L33)

***

### comment

> **comment**: `string` \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:31](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L31)

***

### engine

> **engine**: `string` \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:29](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L29)

***

### foreign\_keys

> **foreign\_keys**: `Record`\<`string`, [`foreign_key_schema_t`](foreign_key_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:37](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L37)

***

### indexes

> **indexes**: `Record`\<`string`, [`index_schema_t`](index_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:40](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L40)

***

### name

> **name**: `string`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:28](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L28)

***

### primary\_key

> **primary\_key**: [`primary_key_schema_t`](primary_key_schema_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:35](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L35)

***

### unique\_constraints

> **unique\_constraints**: `Record`\<`string`, [`unique_constraint_schema_t`](unique_constraint_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:36](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L36)
