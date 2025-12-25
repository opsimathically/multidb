// mongodb
import type {
  coll_change_stream_handler_t,
  db_change_stream_handler_t
} from './classes/mongodb/MongoDB.class';
import { MongoDB } from './classes/mongodb/MongoDB.class';

import type {
  mariadb_query_data_t,
  mariadb_selection_query_t,
  mariadb_table_collumn_definition_t,
  mariadb_table_definition_t
} from './classes/mariadb/MariaDB.class';

import { MariaDB } from './classes/mariadb/MariaDB.class';

import type { mariadb_catlayer_t } from './classes/mariadb/MariaDBError.class';
import { MariaDBError } from './classes/mariadb/MariaDBError.class';

import { MariaDBQueryTemplate } from './classes/mariadb/MariaDBQueryTemplate.class';

import { MariaDBPool } from './classes/mariadb/MariaDBPool.class';

import type {
  query_kind_t,
  validation_error_t,
  validation_warning_t,
  validation_result_t,
  validator_options_t
} from './classes/mariadb/MariaDBSQLQueryValidator.class';

import {
  SQLTokenizer,
  SQLDMLParser,
  MariaDBSQLQueryValidator
} from './classes/mariadb/MariaDBSQLQueryValidator.class';

import type {
  version_row_t,
  sql_dialect_t,
  schema_snapshot_t,
  table_schema_t,
  view_schema_t,
  column_schema_t,
  primary_key_schema_t,
  unique_constraint_schema_t,
  foreign_key_schema_t,
  check_constraint_schema_t,
  index_schema_t,
  index_column_schema_t,
  introspector_options_t,
  query_rows_t,
  information_schema_table_row_t,
  information_schema_column_row_t,
  information_schema_statistics_row_t,
  information_schema_table_constraints_row_t,
  information_schema_key_column_usage_row_t,
  information_schema_referential_constraints_row_t,
  information_schema_check_constraints_row_t,
  information_schema_views_row_t
} from './classes/mariadb/MariaDBDatabaseSchemaIntrospector.class';
import { MariaDBDatabaseSchemaIntrospector } from './classes/mariadb/MariaDBDatabaseSchemaIntrospector.class';

import type {
  mysql_importer_options_t,
  mysql_import_result_t
} from './classes/mariadb/MariaDBDumpImporter.class';
import { MariaDBDumpImporter } from './classes/mariadb/MariaDBDumpImporter.class';

import type {
  mariadb_dump_exporter_config_i,
  mariadb_dump_export_result_t
} from './classes/mariadb/MariaDBDumpExporter.class';
import { MariaDBDumpExporter } from './classes/mariadb/MariaDBDumpExporter.class';

export type {
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MongoDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  coll_change_stream_handler_t,
  db_change_stream_handler_t,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBError %%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  mariadb_catlayer_t,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  mariadb_query_data_t,
  mariadb_selection_query_t,
  mariadb_table_collumn_definition_t,
  mariadb_table_definition_t,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBDumpExporter %%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  mariadb_dump_exporter_config_i,
  mariadb_dump_export_result_t,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBDumpImporter %%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  mysql_importer_options_t,
  mysql_import_result_t,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBDatabaseSchemaIntrospector %%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  version_row_t,
  sql_dialect_t,
  schema_snapshot_t,
  table_schema_t,
  view_schema_t,
  column_schema_t,
  primary_key_schema_t,
  unique_constraint_schema_t,
  foreign_key_schema_t,
  check_constraint_schema_t,
  index_schema_t,
  index_column_schema_t,
  introspector_options_t,
  query_rows_t,
  information_schema_table_row_t,
  information_schema_column_row_t,
  information_schema_statistics_row_t,
  information_schema_table_constraints_row_t,
  information_schema_key_column_usage_row_t,
  information_schema_referential_constraints_row_t,
  information_schema_check_constraints_row_t,
  information_schema_views_row_t,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBSQLQueryValidator %%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  query_kind_t,
  validation_error_t,
  validation_warning_t,
  validation_result_t,
  validator_options_t
};

// export data
export {
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MongoDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MongoDB,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBError %%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBError,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDB,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBQueryTemplate %%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBQueryTemplate,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBPool %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBPool,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBDumpExporter %%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBDumpExporter,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBDumpImporter %%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBDumpImporter,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBDatabaseSchemaIntrospector %%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBDatabaseSchemaIntrospector,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBSQLQueryValidator %%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  SQLTokenizer,
  SQLDMLParser,
  MariaDBSQLQueryValidator
};
