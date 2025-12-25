[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / delete\_ast\_t

# Type Alias: delete\_ast\_t

> **delete\_ast\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:199](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L199)

## Properties

### kind

> **kind**: `"delete"`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:200](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L200)

***

### target

> **target**: [`qualified_table_name_t`](qualified_table_name_t.md)

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:201](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L201)

***

### where\_column\_refs

> **where\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:203](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L203)

***

### where\_span

> **where\_span**: [`expr_span_t`](expr_span_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:202](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L202)
