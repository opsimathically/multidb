[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / schema\_snapshot\_t

# Type Alias: schema\_snapshot\_t

> **schema\_snapshot\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:18](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L18)

## Properties

### database

> **database**: `string`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:22](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L22)

***

### dialect

> **dialect**: [`sql_dialect_t`](sql_dialect_t.md)

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:19](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L19)

***

### loaded\_at

> **loaded\_at**: `Date`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:21](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L21)

***

### server\_version

> **server\_version**: `string`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:20](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L20)

***

### tables

> **tables**: `Record`\<`string`, [`table_schema_t`](table_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:23](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L23)

***

### views

> **views**: `Record`\<`string`, [`view_schema_t`](view_schema_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:24](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L24)
