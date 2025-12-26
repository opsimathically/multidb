// mongodb
import type {
  file_data_t,
  mongodb_databases_t,
  coll_change_stream_handler_t,
  db_change_stream_handler_t
} from './classes/mongodb/MongoDB.class';
import { MongoDB } from './classes/mongodb/MongoDB.class';
import { MongoDBBufferedStackedInsert } from './classes/mongodb/MongoDBBufferedStackedInsert.class';

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
import { MariaDBStackedQueryTemplate } from './classes/mariadb/MariaDBStackedQueryTemplate.class';
import { MariaDBBufferedStackedQueryTemplate } from './classes/mariadb/MariaDBBufferedStackedQueryTemplate.class';

import type {
  flush_callback_t,
  buffered_array_config_i
} from './classes/buffered_array/BufferedArray.class';
import { BufferedArray } from './classes/buffered_array/BufferedArray.class';

import { DualIndexStore } from './classes/dualstore/DualIndexStore.class';

import { MariaDBPool } from './classes/mariadb/MariaDBPool.class';

import type {
  token_kind_t,
  token_t,
  token_stream_t,
  qualified_table_name_t,
  column_ref_t,
  star_ref_t,
  expr_span_t,
  join_clause_t,
  from_source_t,
  select_ast_t,
  insert_ast_t,
  update_ast_t,
  delete_ast_t,
  parsed_query_ast_t,
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
  // %%% Data Types %%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  flush_callback_t,
  buffered_array_config_i,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MongoDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  mongodb_databases_t,
  file_data_t,
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
  token_kind_t,
  token_t,
  token_stream_t,
  qualified_table_name_t,
  column_ref_t,
  star_ref_t,
  expr_span_t,
  join_clause_t,
  from_source_t,
  select_ast_t,
  insert_ast_t,
  update_ast_t,
  delete_ast_t,
  parsed_query_ast_t,
  query_kind_t,
  validation_error_t,
  validation_warning_t,
  validation_result_t,
  validator_options_t
};

// export data
export {
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Data Structures %%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  BufferedArray,
  DualIndexStore,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MongoDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MongoDB,
  MongoDBBufferedStackedInsert,
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBError %%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBError,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDB %%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDB,

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDBQueryTemplates %%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  MariaDBQueryTemplate,
  MariaDBStackedQueryTemplate,
  MariaDBBufferedStackedQueryTemplate,

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
