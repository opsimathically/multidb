[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBDumpImporter

# Class: MariaDBDumpImporter

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:61](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDumpImporter.class.ts#L61)

## Constructors

### Constructor

> **new MariaDBDumpImporter**(`options`): `MariaDBDumpImporter`

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:64](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDumpImporter.class.ts#L64)

#### Parameters

##### options

[`mysql_importer_options_t`](../type-aliases/mysql_importer_options_t.md)

#### Returns

`MariaDBDumpImporter`

## Methods

### importFile()

> **importFile**(`dump_path`): `Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:163](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDumpImporter.class.ts#L163)

#### Parameters

##### dump\_path

`string`

#### Returns

`Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>

***

### importFromStream()

> **importFromStream**(`sql_stream`): `Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDumpImporter.class.ts:74](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mariadb/MariaDBDumpImporter.class.ts#L74)

#### Parameters

##### sql\_stream

`ReadStream`

#### Returns

`Promise`\<[`mysql_import_result_t`](../type-aliases/mysql_import_result_t.md)\>
