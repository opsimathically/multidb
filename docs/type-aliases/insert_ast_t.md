[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / insert\_ast\_t

# Type Alias: insert\_ast\_t

> **insert\_ast\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:182](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L182)

## Properties

### columns

> **columns**: `string`[] \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:186](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L186)

***

### kind

> **kind**: `"insert"`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:183](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L183)

***

### mode

> **mode**: `"values"` \| `"set"`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:185](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L185)

***

### set\_pairs

> **set\_pairs**: `object`[] \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:188](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L188)

***

### target

> **target**: [`qualified_table_name_t`](qualified_table_name_t.md)

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:184](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L184)

***

### values\_rows

> **values\_rows**: [`expr_span_t`](expr_span_t.md)[][] \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:187](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L187)
