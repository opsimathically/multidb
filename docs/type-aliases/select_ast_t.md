[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / select\_ast\_t

# Type Alias: select\_ast\_t

> **select\_ast\_t** = `object`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:162](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L162)

## Properties

### from\_sources

> **from\_sources**: [`from_source_t`](from_source_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:165](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L165)

***

### group\_by\_column\_refs

> **group\_by\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:177](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L177)

***

### group\_by\_spans

> **group\_by\_spans**: [`expr_span_t`](expr_span_t.md)[] \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:167](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L167)

***

### having\_column\_refs

> **having\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:178](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L178)

***

### having\_span

> **having\_span**: [`expr_span_t`](expr_span_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:168](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L168)

***

### join\_on\_column\_refs

> **join\_on\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:176](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L176)

***

### kind

> **kind**: `"select"`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:163](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L163)

***

### limit\_span

> **limit\_span**: [`expr_span_t`](expr_span_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:170](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L170)

***

### order\_by\_column\_refs

> **order\_by\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:179](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L179)

***

### order\_by\_spans

> **order\_by\_spans**: [`expr_span_t`](expr_span_t.md)[] \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:169](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L169)

***

### select\_column\_refs

> **select\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:172](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L172)

***

### select\_expr\_spans

> **select\_expr\_spans**: [`expr_span_t`](expr_span_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:164](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L164)

***

### select\_star\_refs

> **select\_star\_refs**: [`star_ref_t`](star_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:173](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L173)

***

### where\_column\_refs

> **where\_column\_refs**: [`column_ref_t`](column_ref_t.md)[]

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:175](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L175)

***

### where\_span

> **where\_span**: [`expr_span_t`](expr_span_t.md) \| `null`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:166](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L166)
