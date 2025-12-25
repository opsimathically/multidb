[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / SQLDMLParser

# Class: SQLDMLParser

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:485](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L485)

## Constructors

### Constructor

> **new SQLDMLParser**(): `SQLDMLParser`

#### Returns

`SQLDMLParser`

## Methods

### parse()

> **parse**(`sql`): `object`

Defined in: [src/classes/mariadb/MariaDBSQLQueryValidator.class.ts:488](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBSQLQueryValidator.class.ts#L488)

#### Parameters

##### sql

`string`

#### Returns

`object`

##### ast

> **ast**: [`parsed_query_ast_t`](../type-aliases/parsed_query_ast_t.md) \| `null`

##### errors

> **errors**: [`validation_error_t`](../type-aliases/validation_error_t.md)[]

##### warnings

> **warnings**: [`validation_warning_t`](../type-aliases/validation_warning_t.md)[]
