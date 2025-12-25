[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / information\_schema\_table\_constraints\_row\_t

# Type Alias: information\_schema\_table\_constraints\_row\_t

> **information\_schema\_table\_constraints\_row\_t** = `RowDataPacket` & `object`

Defined in: [src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts:163](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBDatabaseSchemaIntrospector.class.ts#L163)

## Type Declaration

### CONSTRAINT\_NAME

> **CONSTRAINT\_NAME**: `string`

### CONSTRAINT\_TYPE

> **CONSTRAINT\_TYPE**: `"PRIMARY KEY"` \| `"UNIQUE"` \| `"FOREIGN KEY"` \| `"CHECK"`

### TABLE\_NAME

> **TABLE\_NAME**: `string`
