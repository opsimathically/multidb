[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / update\_ast\_t

# Type Alias: update\_ast\_t

> **update\_ast\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:191](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L191)

## Properties

### kind

> **kind**: `"update"`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:192](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L192)

***

### set\_pairs

> **set\_pairs**: `object`[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:194](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L194)

#### column

> **column**: [`column_ref_t`](column_ref_t.md)

#### value

> **value**: [`expr_span_t`](expr_span_t.md)

***

### target

> **target**: [`qualified_table_name_t`](qualified_table_name_t.md)

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:193](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L193)

***

### where\_column\_refs

> **where\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:196](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L196)

***

### where\_span

> **where\_span**: [`expr_span_t`](expr_span_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:195](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L195)
