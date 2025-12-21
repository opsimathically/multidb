import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, PoolOptions } from 'mysql2/promise';
import mysql_sync from 'mysql2';

// So, what is this?
//
// I use an introspector to create parsed snapshots of the running database schema and then
// use a query validator to ensure that queries are valid for the schema snapshot being
// queried against.  Why though?
//
// Because unfortunately for the world, SQL works on strings.
//
// These classes attempts to bring a bit of sanity to that world without becomming an ORM.  ORMs
// have several issues, such as query unoptimization, bloat, and obfuscation, pre-build steps,
// and it leads to issues. Similarly, raw SQL has been responsible for more issues than can be
// comprehended by any reasonable person, therefore I imagined a middleground which introduces a bit of
// sanity, without defining an entire ORM.  This code is intended to be used by me, as
// I know what I've done, why, and how.  If you use it, you could very well find yourself
// creating some security hole, or other issue due to the fact that once again, unfortunately
// for the world, SQL works on strings.
//

/*

###########################################
### DDL ###################################
###########################################

DDL statements define or modify database objects such as:

Databases
Tables
Indexes
Views
Triggers
Procedures
Functions
Users

Common DDL commands:
CREATE DATABASE
DROP DATABASE
ALTER DATABASE
CREATE TABLE
ALTER TABLE
DROP TABLE
CREATE INDEX
DROP INDEX
CREATE VIEW
DROP VIEW

##################################
### DML ##########################
##################################
DML statements operate on data inside tables, not on the database structure.

Common DML commands:
SELECT
INSERT
UPDATE
DELETE
REPLACE
CALL
LOAD DATA
LOAD XML

These affect row-level data, not schema objects.

##################################
### DCL ##########################
##################################

DCL - Data Control Language
Manages permissions and security:

GRANT
REVOKE
SET PASSWORD
CREATE USER
DROP USER

##################################
### TCL ##########################
##################################

TCL - Transaction Control Language

Controls transactions:
START TRANSACTION
COMMIT
ROLLBACK
SAVEPOINT
SET TRANSACTION

*/

import { MariaDBError } from './MariaDBError.class';
import { MariaDBDatabaseSchemaIntrospector } from './MariaDBDatabaseSchemaIntrospector.class';
import { MariaDBSQLQueryValidator } from './MariaDBSQLQueryValidator.class';
import { MariaDBPool } from './MariaDBPool.class';
import { MariaDBQueryTemplate } from './MariaDBQueryTemplate.class';
import crypto from 'crypto';

// hash a string or buffer
function sha1(input: string | Buffer): string {
  return crypto.createHash('sha1').update(input).digest('hex');
}

export type mariadb_query_data_t = {
  prefix?: string;
  column: string;
  compare: string;
  value: string | number | string[] | number[];
};

export type mariadb_selection_query_t = {
  query: string;
  parameters: Array<string | number | null>;
};

export type mariadb_table_collumn_definition_t = {
  name: string;
  definition: string;
  keys: string[];
  indexes: string[];
};

export type mariadb_table_definition_t = {
  db: string;
  name: string;
  collumns: mariadb_table_collumn_definition_t[];
};

export class MariaDB {
  connection_pools: Record<string, MariaDBPool> = {};
  admin_pools: Record<string, Pool> = {};

  constructor() {}

  // Add an administrative pool, unaffiliated with any particular database, instead associated
  // to a particular server.  These pools are used for things like CREATE/DROP database requests.
  // Due to their limited functionality, we simply use the Pool object directly rather than the
  // MariaDBPool object.
  async addAdminPool(params: {
    name: string;
    pool_options: PoolOptions;
  }): Promise<boolean> {
    const mariadb_ref = this;
    const admin_pool = mysql.createPool(params.pool_options);
    mariadb_ref.admin_pools[params.name] = admin_pool;
    return true;
  }

  // Add a database pool.
  async addPool(params: {
    name: string;
    db: string;
    pool_options: PoolOptions;
  }): Promise<boolean> {
    // self reference
    const mariadb_ref = this;

    // create promises pool/sync pool.  Both are needed, due to the inability of the promises
    // based api to utilize streaming results.
    const pool = mysql.createPool(params.pool_options);
    const sync_pool = mysql_sync.createPool(params.pool_options);

    // create new introspector
    const introspector = new MariaDBDatabaseSchemaIntrospector(pool, {
      load_check_clauses: true,
      load_view_definitions: true
    });

    // snapshot the database schema
    const schema_snapshot = await introspector.load_database_schema(params.db);

    // create query validator
    const query_validator = new MariaDBSQLQueryValidator(schema_snapshot);

    const mariadb_pool_instance = new MariaDBPool({
      name: params.name,
      db: params.db,
      pool: pool,
      sync_pool: sync_pool,
      pool_options: params.pool_options,
      schema_introspector: introspector,
      query_validator: query_validator,
      schema_snapshot: schema_snapshot
    });

    // set pool
    mariadb_ref.connection_pools[params.name] = mariadb_pool_instance;

    return true;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Queries %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Add a query to the query store, pre-validating it against our
  // parsed schema.  The validation isn't perfect, but it's pretty good
  // for identifying potentially outdated queries in code on startup.
  async addQuery<query_args_g, result_row_g>(params: {
    pool: string;
    db: string;
    name: string;
    query: string;
  }) {
    const mariadb_ref = this;
    const pool = mariadb_ref.connection_pools[params.pool];
    if (!pool) {
      return null;
    }

    // basic query checks
    if (!params.query) return null;
    if (typeof params.query !== 'string') return null;
    if (params.query.length <= 0) return null;

    // validation_result_t
    const query_validation = pool.query_validator.validate(params.query);
    if (!query_validation.ok) {
      throw new MariaDBError({
        msg: 'Query validation failed.',
        code: 1001,
        category: 'DDL',
        type: 'QUERY_INVALID',
        extra: query_validation
      });
      return null;
    }

    // add query template
    const query_hash = sha1(params.query);
    const query = new MariaDBQueryTemplate<query_args_g, result_row_g>({
      query: params.query,
      sha1: query_hash,
      db: params.db,
      pool: pool
    });

    // set the query within our dual store
    pool.query_templates.set(query_hash, query, [params.name]);

    // gather the query by hash
    return pool.query_templates.getByHash(query_hash) as MariaDBQueryTemplate<
      query_args_g,
      result_row_g
    >;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Admin Tools %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Check if a database name is valid.
  // 1. Must be non-empty
  // 2. MariaDB/MySQL max identifier length is 64 characters
  // 3. Must start with a letter or underscore
  // 4. Remaining characters must be letters, digits, or underscore
  isValidDatabaseNameString(name: string): boolean {
    if (typeof name !== 'string' || name.length === 0) return false;
    if (name.length > 64) return false;
    if (!/^[A-Za-z_]/.test(name)) return false;
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return false;
    return true;
  }

  async dropDatabaseIfExists(params: {
    adminpool: string;
    db: string;
  }): Promise<boolean> {
    const mariadb_ref = this;
    const adminpool = mariadb_ref.admin_pools[params.adminpool];
    if (!adminpool) {
      return false;
    }

    // ensure the database name is valid
    if (!mariadb_ref.isValidDatabaseNameString(params.db)) {
      throw new MariaDBError({
        msg: 'Invalid database name.',
        code: 1001,
        category: 'DDL',
        type: 'SANITY'
      });
      return false;
    }

    const [row] = await adminpool.query<RowDataPacket[]>(
      `DROP DATABASE IF EXISTS ${params.db};`
    );
    if (!row) {
      throw new MariaDBError({
        msg: 'Query failed.',
        code: 1002,
        category: 'DDL',
        type: 'BAD_QUERY'
      });
      return false;
    }
    return true;
  }

  // attempt to create a database
  async createDatabaseIfNotExists(params: {
    adminpool: string;
    db: string;
  }): Promise<boolean> {
    const mariadb_ref = this;
    const adminpool = mariadb_ref.admin_pools[params.adminpool];
    if (!adminpool) {
      return false;
    }

    // ensure the database name is valid
    if (!mariadb_ref.isValidDatabaseNameString(params.db)) {
      throw new MariaDBError({
        msg: 'Invalid database name.',
        code: 1001,
        category: 'DDL',
        type: 'SANITY'
      });
      return false;
    }

    const [row] = await adminpool.query<RowDataPacket[]>(
      `CREATE DATABASE IF NOT EXISTS ${params.db};`
    );

    if (!row) {
      throw new MariaDBError({
        msg: 'Query failed.',
        code: 1002,
        category: 'DDL',
        type: 'BAD_QUERY'
      });
      return false;
    }
    return true;
  }

  // check if a database exists
  async databaseExists(params: { pool: string; db: string }): Promise<boolean> {
    const mariadb_ref = this;
    if (!mariadb_ref.connection_pools[params.pool]) {
      throw new MariaDBError({
        msg: 'No connection pool available.',
        code: 1000,
        category: 'DDL',
        type: 'POOL'
      });
      return false;
    }

    const [rows] = await mariadb_ref.connection_pools[params.pool].pool.query<
      RowDataPacket[]
    >(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [params.db]
    );
    return rows.length > 0;
  }

  // check if a table exists
  async tableExists(params: {
    pool: string;
    db: string;
    table: string;
  }): Promise<boolean> {
    const mariadb_ref = this;
    if (!mariadb_ref.connection_pools[params.pool]) {
      throw new MariaDBError({
        msg: 'No connection pool available.',
        code: 1000,
        category: 'DDL',
        type: 'POOL'
      });
      return false;
    }

    const [rows] = await mariadb_ref.connection_pools[params.pool].pool.query<
      RowDataPacket[]
    >(
      'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [params.db, params.table]
    );

    return rows.length > 0;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Queries %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  async createTable(params: {
    pool: string;
    db: string;
    definition: mariadb_table_definition_t;
  }) {
    const mariadb_ref = this;
    if (!mariadb_ref.connection_pools[params.pool]) {
      throw new MariaDBError({
        msg: 'No connection pool available.',
        code: 1000,
        category: 'DDL',
        type: 'POOL'
      });

      return false;
    }
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% SQL Query Utilities %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // generate a selection query (simple query generator utility for search routines)
  async generateSelectionQuery(params: {
    table_name: string;
    selecting_columns: string[];
    allowed_prefixes: string[];
    allowed_columns: string[];
    allowed_compares: string[];
    query_data: mariadb_query_data_t[];
  }): Promise<null | mariadb_selection_query_t> {
    // check table name
    const selecting_columns = params.selecting_columns;
    const table_name = params.table_name;
    const allowed_prefixes = params.allowed_prefixes;
    const allowed_columns = params.allowed_columns;
    const allowed_compares = params.allowed_compares;
    const query_data = params.query_data;

    // parameters which will be selected
    const select_parameters: Array<number | string> = [];

    // iterate through
    if (Array.isArray(query_data) !== true) return null;

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%% Generate Selector Query Part %%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    if (Array.isArray(selecting_columns) === false) return null;

    // this holds the selector parts
    let selector_part = '';

    // iterate through selecting collumns
    for (let idx = 0; idx < selecting_columns.length; idx++) {
      // gather column name
      const column_name = selecting_columns[idx];

      // ensure the column is allowed
      if (allowed_columns.indexOf(column_name) === -1) {
        return null;
      }

      // set the selector part
      selector_part += '\n\t' + column_name;

      // break if we have no more entries
      if (idx + 1 >= selecting_columns.length) break;

      // add comma if necessary
      selector_part += ', ';
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%% Generate Select Query Compare Part %%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    // set the compare query part
    let compare_query_part = '';

    // iterate through query data
    for (let idx = 0; idx < query_data.length; idx++) {
      // gather query item
      const query_data_item = query_data[idx];

      // ensure the column is allowed for searching
      if (allowed_columns.indexOf(query_data_item.column) === -1) {
        return null;
      }

      // ensure the compare is within the allowed set
      if (allowed_compares.indexOf(query_data_item.compare) === -1) {
        return null;
      }

      // column and compare
      const col = query_data_item.column;
      const compare = query_data_item.compare;

      // add the query part
      let query_part = ` ${col} ${compare} `;

      // value part of the query
      let value_part = '';

      // prepare the compares, IN vs single parameter
      if (compare === 'IN') {
        // run data checks
        if (Array.isArray(query_data_item.value) !== true) {
          return null;
        }
        if (query_data_item.value.length <= 0) {
          return null;
        }

        // generate value part from data
        value_part = '';
        for (
          let data_idx = 0;
          data_idx < query_data_item.value.length;
          data_idx++
        ) {
          // add query parameter
          value_part += '?';

          // add parameter
          select_parameters.push(query_data_item.value[data_idx]);

          // break if we have no data
          if (data_idx + 1 >= query_data_item.value.length) break;

          // add comma if necessary
          value_part += ',';
        }

        // surround IN values with parenthesis
        value_part = ' ( ' + value_part + ' ) ';
      } else {
        // set value part
        value_part = '? ';

        // add parameter
        if (
          typeof query_data_item.value === 'string' ||
          typeof query_data_item.value === 'number'
        ) {
          select_parameters.push(query_data_item.value);
        }
      }

      // if we have no prefix, simply move to next
      if (!query_data_item.prefix) {
        compare_query_part += '\n\t' + query_part + ' ' + value_part + ' ';
        continue;
      }

      // ensure the prefix is within the allowed set
      if (allowed_prefixes.indexOf(query_data_item.prefix) === -1) {
        return null;
      }

      // add query part
      query_part = query_data_item.prefix + query_part + ' ' + value_part;

      // gather compare
      compare_query_part += '\n\t' + query_part;
    }

    // return the full query with parameters
    return {
      query:
        'SELECT ' +
        selector_part +
        ' \nFROM ' +
        table_name +
        ' \nWHERE ' +
        compare_query_part,
      parameters: select_parameters
    };
  }
}
