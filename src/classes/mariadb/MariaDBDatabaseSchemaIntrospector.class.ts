import type {
  Pool,
  PoolOptions,
  RowDataPacket,
  FieldPacket
} from 'mysql2/promise';
import mysql from 'mysql2/promise';
/*
Full Disclosure: 
This code was AI generated, but seems to work and does something quite amazing.
*/

type version_row_t = RowDataPacket & { VERSION: string };

export type sql_dialect_t = 'mysql' | 'mariadb';

export type schema_snapshot_t = {
  dialect: sql_dialect_t;
  server_version: string;
  loaded_at: Date;
  database: string;
  tables: Record<string, table_schema_t>;
  views: Record<string, view_schema_t>;
};

export type table_schema_t = {
  name: string;
  engine: string | null;
  collation: string | null;
  comment: string | null;

  columns: Record<string, column_schema_t>;

  primary_key: primary_key_schema_t | null;
  unique_constraints: Record<string, unique_constraint_schema_t>;
  foreign_keys: Record<string, foreign_key_schema_t>;
  check_constraints: Record<string, check_constraint_schema_t>;

  indexes: Record<string, index_schema_t>;
};

export type view_schema_t = {
  name: string;
  definition: string | null;
  definer: string | null;
  security_type: string | null;
  check_option: string | null;
  collation: string | null;
};

export type column_schema_t = {
  name: string;
  ordinal_position: number;

  data_type: string;
  column_type: string;
  is_nullable: boolean;

  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  datetime_precision: number | null;

  collation_name: string | null;
  character_set_name: string | null;

  default: string | null;
  is_auto_increment: boolean;
  is_generated: boolean;
  generation_expression: string | null;

  comment: string | null;
};

export type primary_key_schema_t = {
  name: string;
  columns: string[];
};

export type unique_constraint_schema_t = {
  name: string;
  columns: string[];
};

export type foreign_key_schema_t = {
  name: string;
  columns: string[];
  referenced_table: string;
  referenced_columns: string[];
  update_rule: string | null;
  delete_rule: string | null;
};

export type check_constraint_schema_t = {
  name: string;
  clause: string | null;
};

export type index_schema_t = {
  name: string;
  is_unique: boolean;
  is_primary: boolean;
  index_type: string | null;
  columns: index_column_schema_t[];
};

export type index_column_schema_t = {
  name: string;
  seq_in_index: number;
  sub_part: number | null;
  direction: 'ASC' | 'DESC' | null;
};

export type introspector_options_t = {
  dialect_hint?: sql_dialect_t;
  load_view_definitions?: boolean;
  load_check_clauses?: boolean;
};

type query_rows_t<T extends RowDataPacket> = Promise<[T[], FieldPacket[]]>;

type information_schema_table_row_t = RowDataPacket & {
  TABLE_NAME: string;
  TABLE_TYPE: 'BASE TABLE' | 'VIEW';
  ENGINE: string | null;
  TABLE_COLLATION: string | null;
  TABLE_COMMENT: string | null;
};

type information_schema_column_row_t = RowDataPacket & {
  TABLE_NAME: string;
  COLUMN_NAME: string;
  ORDINAL_POSITION: number;
  IS_NULLABLE: 'YES' | 'NO';
  DATA_TYPE: string;
  COLUMN_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  NUMERIC_PRECISION: number | null;
  NUMERIC_SCALE: number | null;
  DATETIME_PRECISION: number | null;
  COLLATION_NAME: string | null;
  CHARACTER_SET_NAME: string | null;
  COLUMN_DEFAULT: string | null;
  EXTRA: string | null;
  GENERATION_EXPRESSION: string | null;
  COLUMN_COMMENT: string | null;
};

type information_schema_statistics_row_t = RowDataPacket & {
  TABLE_NAME: string;
  INDEX_NAME: string;
  NON_UNIQUE: 0 | 1;
  SEQ_IN_INDEX: number;
  COLUMN_NAME: string | null;
  SUB_PART: number | null;
  COLLATION: 'A' | 'D' | null;
  INDEX_TYPE: string | null;
};

type information_schema_table_constraints_row_t = RowDataPacket & {
  TABLE_NAME: string;
  CONSTRAINT_NAME: string;
  CONSTRAINT_TYPE: 'PRIMARY KEY' | 'UNIQUE' | 'FOREIGN KEY' | 'CHECK';
};

type information_schema_key_column_usage_row_t = RowDataPacket & {
  TABLE_NAME: string;
  CONSTRAINT_NAME: string;
  COLUMN_NAME: string;
  ORDINAL_POSITION: number;
  REFERENCED_TABLE_NAME: string | null;
  REFERENCED_COLUMN_NAME: string | null;
};

type information_schema_referential_constraints_row_t = RowDataPacket & {
  CONSTRAINT_NAME: string;
  TABLE_NAME: string;
  UPDATE_RULE: string | null;
  DELETE_RULE: string | null;
};

type information_schema_check_constraints_row_t = RowDataPacket & {
  CONSTRAINT_NAME: string;
  CHECK_CLAUSE: string | null;
};

type information_schema_views_row_t = RowDataPacket & {
  TABLE_NAME: string;
  VIEW_DEFINITION: string | null;
  DEFINER: string | null;
  SECURITY_TYPE: string | null;
  CHECK_OPTION: string | null;
  COLLATION_CONNECTION: string | null;
};

function placeholders(n: number): string {
  return Array.from({ length: n }, () => '?').join(', ');
}

function is_pool(v: any): v is Pool {
  return v && typeof v.getConnection === 'function';
}

function map_index_direction(v: 'A' | 'D' | null): 'ASC' | 'DESC' | null {
  if (v === 'A') return 'ASC';
  if (v === 'D') return 'DESC';
  return null;
}

function lower(s: string | null | undefined): string {
  return (s ?? '').toLowerCase();
}

export class MariaDBDatabaseSchemaIntrospector {
  private readonly pool: Pool;
  private snapshot: schema_snapshot_t | null = null;
  private readonly opts: Required<introspector_options_t>;

  constructor(
    pool_or_options: Pool | PoolOptions,
    opts?: introspector_options_t
  ) {
    this.pool = is_pool(pool_or_options)
      ? pool_or_options
      : mysql.createPool(pool_or_options);

    this.opts = {
      dialect_hint: opts?.dialect_hint ?? 'mysql',
      load_view_definitions: opts?.load_view_definitions ?? true,
      load_check_clauses: opts?.load_check_clauses ?? true
    };
  }

  public get_snapshot(): schema_snapshot_t | null {
    return this.snapshot;
  }

  public require_snapshot(): schema_snapshot_t {
    if (!this.snapshot) {
      throw new Error(
        'schema snapshot is not loaded; call load_database_schema()'
      );
    }
    return this.snapshot;
  }

  public get_table(table_name: string): table_schema_t | null {
    const snapshot = this.snapshot;
    if (!snapshot) return null;
    return snapshot.tables[table_name] ?? null;
  }

  public get_view(view_name: string): view_schema_t | null {
    const snapshot = this.snapshot;
    if (!snapshot) return null;
    return snapshot.views[view_name] ?? null;
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  public async load_database_schema(
    database: string
  ): Promise<schema_snapshot_t> {
    const [dialect, server_version] = await this.detect_dialect_and_version();

    const loaded_at = new Date();

    const tables_and_views = await this.fetch_tables_and_views(database);

    const base_tables = tables_and_views.filter(
      (t) => t.TABLE_TYPE === 'BASE TABLE'
    );
    const views = tables_and_views.filter((t) => t.TABLE_TYPE === 'VIEW');

    const table_names = base_tables.map((t) => t.TABLE_NAME);
    const view_names = views.map((t) => t.TABLE_NAME);

    const [
      column_rows,
      stats_rows,
      table_constraints_rows,
      key_column_usage_rows,
      referential_constraints_rows,
      check_constraints_rows,
      view_rows
    ] = await Promise.all([
      this.fetch_columns(database, table_names),
      this.fetch_statistics(database, table_names),
      this.fetch_table_constraints(database, table_names),
      this.fetch_key_column_usage(database, table_names),
      this.fetch_referential_constraints(database, table_names),
      this.opts.load_check_clauses
        ? this.fetch_check_constraints(database)
        : Promise.resolve([] as information_schema_check_constraints_row_t[]),
      this.opts.load_view_definitions
        ? this.fetch_views(database, view_names)
        : Promise.resolve([] as information_schema_views_row_t[])
    ]);

    const snapshot: schema_snapshot_t = {
      dialect,
      server_version,
      loaded_at,
      database,
      tables: {},
      views: {}
    };

    // init tables
    for (const t of base_tables) {
      snapshot.tables[t.TABLE_NAME] = {
        name: t.TABLE_NAME,
        engine: t.ENGINE,
        collation: t.TABLE_COLLATION,
        comment: t.TABLE_COMMENT,

        columns: {},

        primary_key: null,
        unique_constraints: {},
        foreign_keys: {},
        check_constraints: {},

        indexes: {}
      };
    }

    // init views
    if (this.opts.load_view_definitions) {
      for (const v of view_rows) {
        snapshot.views[v.TABLE_NAME] = {
          name: v.TABLE_NAME,
          definition: v.VIEW_DEFINITION,
          definer: v.DEFINER,
          security_type: v.SECURITY_TYPE,
          check_option: v.CHECK_OPTION,
          collation: v.COLLATION_CONNECTION
        };
      }
    } else {
      for (const view_name of view_names) {
        snapshot.views[view_name] = {
          name: view_name,
          definition: null,
          definer: null,
          security_type: null,
          check_option: null,
          collation: null
        };
      }
    }

    // columns
    for (const c of column_rows) {
      const table = snapshot.tables[c.TABLE_NAME];
      if (!table) continue;

      table.columns[c.COLUMN_NAME] = {
        name: c.COLUMN_NAME,
        ordinal_position: c.ORDINAL_POSITION,

        data_type: lower(c.DATA_TYPE),
        column_type: c.COLUMN_TYPE,
        is_nullable: c.IS_NULLABLE === 'YES',

        character_maximum_length: c.CHARACTER_MAXIMUM_LENGTH,
        numeric_precision: c.NUMERIC_PRECISION,
        numeric_scale: c.NUMERIC_SCALE,
        datetime_precision: c.DATETIME_PRECISION,

        collation_name: c.COLLATION_NAME,
        character_set_name: c.CHARACTER_SET_NAME,

        default: c.COLUMN_DEFAULT,
        is_auto_increment: lower(c.EXTRA).includes('auto_increment'),
        is_generated:
          lower(c.EXTRA).includes('generated') ||
          (c.GENERATION_EXPRESSION ?? '').length > 0,
        generation_expression: c.GENERATION_EXPRESSION,

        comment: c.COLUMN_COMMENT
      };
    }

    // indexes
    for (const s of stats_rows) {
      const table = snapshot.tables[s.TABLE_NAME];
      if (!table) continue;

      const index_name = s.INDEX_NAME;

      const idx =
        table.indexes[index_name] ??
        (table.indexes[index_name] = {
          name: index_name,
          is_unique: s.NON_UNIQUE === 0,
          is_primary: index_name === 'PRIMARY',
          index_type: s.INDEX_TYPE,
          columns: []
        });

      // expression/functional indexes may have COLUMN_NAME null on some servers/versions
      if (s.COLUMN_NAME) {
        idx.columns.push({
          name: s.COLUMN_NAME,
          seq_in_index: s.SEQ_IN_INDEX,
          sub_part: s.SUB_PART,
          direction: map_index_direction(s.COLLATION)
        });
      }
    }

    // sort index columns
    for (const table of Object.values(snapshot.tables)) {
      for (const idx of Object.values(table.indexes)) {
        idx.columns.sort((a, b) => a.seq_in_index - b.seq_in_index);
      }
    }

    // constraint helpers: group key usage by (table, constraint)
    const key_usage_by_table_constraint = new Map<
      string,
      information_schema_key_column_usage_row_t[]
    >();
    for (const kcu of key_column_usage_rows) {
      const map_key = `${kcu.TABLE_NAME}::${kcu.CONSTRAINT_NAME}`;
      const arr = key_usage_by_table_constraint.get(map_key) ?? [];
      arr.push(kcu);
      key_usage_by_table_constraint.set(map_key, arr);
    }

    // ref rules by (table, constraint)
    const ref_rules_by_table_constraint = new Map<
      string,
      information_schema_referential_constraints_row_t
    >();
    for (const rc of referential_constraints_rows) {
      const map_key = `${rc.TABLE_NAME}::${rc.CONSTRAINT_NAME}`;
      ref_rules_by_table_constraint.set(map_key, rc);
    }

    // check clause by constraint name
    const check_clause_by_name = new Map<string, string | null>();
    for (const cc of check_constraints_rows) {
      check_clause_by_name.set(cc.CONSTRAINT_NAME, cc.CHECK_CLAUSE);
    }

    // apply constraints
    for (const tc of table_constraints_rows) {
      const table = snapshot.tables[tc.TABLE_NAME];
      if (!table) continue;

      const map_key = `${tc.TABLE_NAME}::${tc.CONSTRAINT_NAME}`;
      const usage_rows = (
        key_usage_by_table_constraint.get(map_key) ?? []
      ).slice();
      usage_rows.sort((a, b) => a.ORDINAL_POSITION - b.ORDINAL_POSITION);

      if (tc.CONSTRAINT_TYPE === 'PRIMARY KEY') {
        table.primary_key = {
          name: tc.CONSTRAINT_NAME,
          columns: usage_rows.map((u) => u.COLUMN_NAME)
        };
        continue;
      }

      if (tc.CONSTRAINT_TYPE === 'UNIQUE') {
        table.unique_constraints[tc.CONSTRAINT_NAME] = {
          name: tc.CONSTRAINT_NAME,
          columns: usage_rows.map((u) => u.COLUMN_NAME)
        };
        continue;
      }

      if (tc.CONSTRAINT_TYPE === 'FOREIGN KEY') {
        const referenced_table = usage_rows[0]?.REFERENCED_TABLE_NAME ?? '';

        const fk: foreign_key_schema_t = {
          name: tc.CONSTRAINT_NAME,
          columns: usage_rows.map((u) => u.COLUMN_NAME),
          referenced_table,
          referenced_columns: usage_rows.map(
            (u) => u.REFERENCED_COLUMN_NAME ?? ''
          ),
          update_rule: null,
          delete_rule: null
        };

        const rc = ref_rules_by_table_constraint.get(map_key);
        if (rc) {
          fk.update_rule = rc.UPDATE_RULE;
          fk.delete_rule = rc.DELETE_RULE;
        }

        table.foreign_keys[tc.CONSTRAINT_NAME] = fk;
        continue;
      }

      if (tc.CONSTRAINT_TYPE === 'CHECK') {
        table.check_constraints[tc.CONSTRAINT_NAME] = {
          name: tc.CONSTRAINT_NAME,
          clause: this.opts.load_check_clauses
            ? (check_clause_by_name.get(tc.CONSTRAINT_NAME) ?? null)
            : null
        };
        continue;
      }
    }

    this.snapshot = snapshot;
    return snapshot;
  }

  public async refresh(): Promise<schema_snapshot_t> {
    const snapshot = this.require_snapshot();
    return this.load_database_schema(snapshot.database);
  }

  public assert_table_exists(table_name: string): void {
    const snapshot = this.require_snapshot();
    if (!snapshot.tables[table_name]) {
      throw new Error(
        `table does not exist: ${snapshot.database}.${table_name}`
      );
    }
  }

  public assert_column_exists(table_name: string, column_name: string): void {
    const table = this.get_table_or_throw(table_name);
    if (!table.columns[column_name]) {
      const snapshot = this.require_snapshot();
      throw new Error(
        `column does not exist: ${snapshot.database}.${table_name}.${column_name}`
      );
    }
  }

  public get_table_or_throw(table_name: string): table_schema_t {
    const table = this.get_table(table_name);
    if (!table) {
      const snapshot = this.require_snapshot();
      throw new Error(`table not found: ${snapshot.database}.${table_name}`);
    }
    return table;
  }

  private async detect_dialect_and_version(): Promise<[sql_dialect_t, string]> {
    const [rows] = await this.query<version_row_t>(
      'SELECT VERSION() AS VERSION'
    );

    const server_version = rows[0]?.VERSION ?? 'unknown';
    const dialect: sql_dialect_t = /mariadb/i.test(server_version)
      ? 'mariadb'
      : (this.opts.dialect_hint ?? 'mysql');
    return [dialect, server_version];
  }

  private async fetch_tables_and_views(
    database: string
  ): Promise<information_schema_table_row_t[]> {
    const sql = `
      SELECT
        TABLE_NAME,
        TABLE_TYPE,
        ENGINE,
        TABLE_COLLATION,
        TABLE_COMMENT
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `;
    const [rows] = await this.query<information_schema_table_row_t>(sql, [
      database
    ]);
    return rows;
  }

  private async fetch_columns(
    database: string,
    table_names: string[]
  ): Promise<information_schema_column_row_t[]> {
    if (table_names.length === 0) return [];
    const sql = `
      SELECT
        TABLE_NAME,
        COLUMN_NAME,
        ORDINAL_POSITION,
        IS_NULLABLE,
        DATA_TYPE,
        COLUMN_TYPE,
        CHARACTER_MAXIMUM_LENGTH,
        NUMERIC_PRECISION,
        NUMERIC_SCALE,
        DATETIME_PRECISION,
        COLLATION_NAME,
        CHARACTER_SET_NAME,
        COLUMN_DEFAULT,
        EXTRA,
        GENERATION_EXPRESSION,
        COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME IN (${placeholders(table_names.length)})
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `;
    const [rows] = await this.query<information_schema_column_row_t>(sql, [
      database,
      ...table_names
    ]);
    return rows;
  }

  private async fetch_statistics(
    database: string,
    table_names: string[]
  ): Promise<information_schema_statistics_row_t[]> {
    if (table_names.length === 0) return [];
    const sql = `
      SELECT
        TABLE_NAME,
        INDEX_NAME,
        NON_UNIQUE,
        SEQ_IN_INDEX,
        COLUMN_NAME,
        SUB_PART,
        COLLATION,
        INDEX_TYPE
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME IN (${placeholders(table_names.length)})
      ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
    `;
    const [rows] = await this.query<information_schema_statistics_row_t>(sql, [
      database,
      ...table_names
    ]);
    return rows;
  }

  private async fetch_table_constraints(
    database: string,
    table_names: string[]
  ): Promise<information_schema_table_constraints_row_t[]> {
    if (table_names.length === 0) return [];
    const sql = `
      SELECT
        TABLE_NAME,
        CONSTRAINT_NAME,
        CONSTRAINT_TYPE
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ?
        AND TABLE_NAME IN (${placeholders(table_names.length)})
      ORDER BY TABLE_NAME, CONSTRAINT_NAME
    `;
    const [rows] = await this.query<information_schema_table_constraints_row_t>(
      sql,
      [database, ...table_names]
    );
    return rows;
  }

  private async fetch_key_column_usage(
    database: string,
    table_names: string[]
  ): Promise<information_schema_key_column_usage_row_t[]> {
    if (table_names.length === 0) return [];
    const sql = `
      SELECT
        TABLE_NAME,
        CONSTRAINT_NAME,
        COLUMN_NAME,
        ORDINAL_POSITION,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE CONSTRAINT_SCHEMA = ?
        AND TABLE_NAME IN (${placeholders(table_names.length)})
      ORDER BY TABLE_NAME, CONSTRAINT_NAME, ORDINAL_POSITION
    `;
    const [rows] = await this.query<information_schema_key_column_usage_row_t>(
      sql,
      [database, ...table_names]
    );
    return rows;
  }

  private async fetch_referential_constraints(
    database: string,
    table_names: string[]
  ): Promise<information_schema_referential_constraints_row_t[]> {
    if (table_names.length === 0) return [];
    const sql = `
      SELECT
        CONSTRAINT_NAME,
        TABLE_NAME,
        UPDATE_RULE,
        DELETE_RULE
      FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ?
        AND TABLE_NAME IN (${placeholders(table_names.length)})
      ORDER BY TABLE_NAME, CONSTRAINT_NAME
    `;
    const [rows] =
      await this.query<information_schema_referential_constraints_row_t>(sql, [
        database,
        ...table_names
      ]);
    return rows;
  }

  private async fetch_check_constraints(
    database: string
  ): Promise<information_schema_check_constraints_row_t[]> {
    const sql = `
      SELECT
        CONSTRAINT_NAME,
        CHECK_CLAUSE
      FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ?
    `;
    const [rows] = await this.query<information_schema_check_constraints_row_t>(
      sql,
      [database]
    );
    return rows;
  }

  private async fetch_views(
    database: string,
    view_names: string[]
  ): Promise<information_schema_views_row_t[]> {
    if (view_names.length === 0) return [];
    const sql = `
      SELECT
        TABLE_NAME,
        VIEW_DEFINITION,
        DEFINER,
        SECURITY_TYPE,
        CHECK_OPTION,
        COLLATION_CONNECTION
      FROM INFORMATION_SCHEMA.VIEWS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME IN (${placeholders(view_names.length)})
      ORDER BY TABLE_NAME
    `;
    const [rows] = await this.query<information_schema_views_row_t>(sql, [
      database,
      ...view_names
    ]);
    return rows;
  }

  private async query<T extends RowDataPacket>(
    sql: string,
    params?: any[]
  ): query_rows_t<T> {
    return this.pool.query<T[]>(sql, params);
  }
}
