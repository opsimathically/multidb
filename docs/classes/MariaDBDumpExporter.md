[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MariaDBDumpExporter

# Class: MariaDBDumpExporter

Defined in: [src/classes/mariadb/MariaDBDumpExporter.class.ts:34](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBDumpExporter.class.ts#L34)

## Constructors

### Constructor

> **new MariaDBDumpExporter**(`dump_config`): `MariaDBDumpExporter`

Defined in: [src/classes/mariadb/MariaDBDumpExporter.class.ts:37](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBDumpExporter.class.ts#L37)

#### Parameters

##### dump\_config

[`mariadb_dump_exporter_config_i`](../interfaces/mariadb_dump_exporter_config_i.md)

#### Returns

`MariaDBDumpExporter`

## Methods

### exportDatabase()

> **exportDatabase**(): `Promise`\<[`mariadb_dump_export_result_t`](../type-aliases/mariadb_dump_export_result_t.md)\>

Defined in: [src/classes/mariadb/MariaDBDumpExporter.class.ts:41](https://github.com/opsimathically/multidb/blob/091f746a3471acd4096efe66a259a434477f66b7/src/classes/mariadb/MariaDBDumpExporter.class.ts#L41)

#### Returns

`Promise`\<[`mariadb_dump_export_result_t`](../type-aliases/mariadb_dump_export_result_t.md)\>
