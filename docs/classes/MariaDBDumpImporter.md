[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBDumpImporter

# Class: MariaDBDumpImporter

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:56](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBDumpImporter.class.ts#L56)

## Constructors

### Constructor

> **new MariaDBDumpImporter**(`options`): `MariaDBDumpImporter`

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:59](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBDumpImporter.class.ts#L59)

#### Parameters

##### options

[`mysql_importer_options_t`](../type-aliases/mysql_importer_options_t.md)

#### Returns

`MariaDBDumpImporter`

## Methods

### importFile()

> **importFile**(`dump_path`): `Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:158](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBDumpImporter.class.ts#L158)

#### Parameters

##### dump\_path

`string`

#### Returns

`Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>

***

### importFromStream()

> **importFromStream**(`sql_stream`): `Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:69](https://github.com/opsimathically/multidb/blob/0e247fabc5845e87689c3e7ef797697663764446/src/classes/mariadb/MariaDBDumpImporter.class.ts#L69)

#### Parameters

##### sql\_stream

`ReadStream`

#### Returns

`Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>
