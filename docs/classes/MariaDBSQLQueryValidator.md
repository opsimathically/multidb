[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBSQLQueryValidator

# Class: MariaDBSQLQueryValidator

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:1670](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L1670)

## Constructors

### Constructor

> **new MariaDBSQLQueryValidator**(`schema_snapshot`, `opts?`): `MariaDBSQLQueryValidator`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:1675](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L1675)

#### Parameters

##### schema\_snapshot

[`schema_snapshot_t`](../type-aliases/schema_snapshot_t.md)

##### opts?

[`validator_options_t`](../type-aliases/validator_options_t.md)

#### Returns

`MariaDBSQLQueryValidator`

## Methods

### validate()

> **validate**(`sql`): [`validation_result_t`](../type-aliases/validation_result_t.md)

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:1682](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L1682)

#### Parameters

##### sql

`string`

#### Returns

[`validation_result_t`](../type-aliases/validation_result_t.md)
