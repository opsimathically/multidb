export type mariadb_select_query_t = {
  query: string;
  parameters: Array<string | number | null>;
};

export type mariadb_select_query_data_t = {
  prefix?: string;
  column: string;
  compare: string;
  value: string | number | string[] | number[];
};

export type mariadb_select_error_t = {
  code: number;
  msg: string;
};

export class MariaDBSelectQueryError extends Error {
  data: {
    code: number;
    type: string;
    msg: string;
  } = {
    code: -1,
    type: 'NOTYPE',
    msg: 'NOMSG'
  };

  constructor(params: { msg: string; type: string; code: number }) {
    super(params.msg);
    this.data = params;
  }
}

export class MariaDBSelectQueryModel {
  table_name: string | undefined;
  allowed_prefixes: Record<string, boolean> = {};
  allowed_columns: Record<string, boolean> = {};
  allowed_compares: Record<string, boolean> = {};

  // construct the query model
  constructor(params: {
    table_name: string;
    allowed_prefixes: Record<string, boolean>;
    allowed_columns: Record<string, boolean>;
    allowed_compares: Record<string, boolean>;
  }) {
    this.table_name = params.table_name;
    this.allowed_prefixes = params.allowed_prefixes;
    this.allowed_columns = params.allowed_columns;
    this.allowed_compares = params.allowed_compares;
  }

  // prepare
  async prepare(params: {
    selecting: string[];
    constraints: mariadb_select_query_data_t[];
  }) {
    const mariadb_select_model_ref = this;

    throw new MariaDBSelectQueryError({
      msg: 'Failed to prepare',
      code: 1,
      type: 'SELECT'
    });
  }
}
