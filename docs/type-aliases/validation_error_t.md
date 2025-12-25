[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / validation\_error\_t

# Type Alias: validation\_error\_t

> **validation\_error\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:56](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L56)

## Properties

### code

> **code**: `"unsupported_query"` \| `"parse_error"` \| `"unknown_table"` \| `"unknown_column"` \| `"ambiguous_column"` \| `"invalid_qualifier"` \| `"values_count_mismatch"` \| `"missing_set_clause"` \| `"missing_values_clause"` \| `"missing_table"` \| `"invalid_syntax"`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:57](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L57)

***

### message

> **message**: `string`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:69](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L69)

***

### position?

> `optional` **position**: `number`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:70](https://github.com/opsimathically/multidb/blob/cb87dfe12e5751ac730d96032e7ecbce4dd94ef0/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L70)
