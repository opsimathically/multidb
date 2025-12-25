[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBSQLQueryValidator

# Class: MariaDBSQLQueryValidator

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:1670](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L1670)

## Constructors

### Constructor

> **new MariaDBSQLQueryValidator**(`schema_snapshot`, `opts?`): `MariaDBSQLQueryValidator`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:1675](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L1675)

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

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:1682](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L1682)

#### Parameters

##### sql

`string`

#### Returns

[`validation_result_t`](../type-aliases/validation_result_t.md)
