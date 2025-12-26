import type { MariaDBPool } from './MariaDBPool.class';

import { BufferedArray } from '../buffered_array/BufferedArray.class';

export class MariaDBBufferedStackedQueryTemplate<query_args_g, result_row_g> {
  // eg: INSERT INTO table_name (col_name1, col_name2, col_name3)
  query_insert_and_columns: string;
  // trailing clause: eg ON DUPLICATE KEY UPDATE b = VALUES(b);
  trailing_clause?: string;
  // eg: The number of (?, ?, ?), which would be 3 here.
  expected_value_set_count: number;
  db: string;
  pool: MariaDBPool;
  sha1: string;
  buffered_array: BufferedArray<
    query_args_g,
    MariaDBBufferedStackedQueryTemplate<query_args_g, result_row_g>
  >;

  constructor(params: {
    query_insert_and_columns: string;
    trailing_clause?: string;
    expected_value_set_count: number;
    max_len: number;
    interval_ms: number;
    db: string;
    pool: MariaDBPool;
    sha1: string;
  }) {
    this.query_insert_and_columns = params.query_insert_and_columns;
    this.trailing_clause = params.trailing_clause;
    this.expected_value_set_count = params.expected_value_set_count;
    this.db = params.db;
    this.pool = params.pool;
    this.sha1 = params.sha1;
    const query_template_ref = this;
    this.buffered_array = new BufferedArray<
      query_args_g,
      MariaDBBufferedStackedQueryTemplate<query_args_g, result_row_g>
    >({
      config: { interval_ms: params.interval_ms, max_length: params.max_len },
      extra: query_template_ref,
      flush_callback: async function (params: {
        extra: MariaDBBufferedStackedQueryTemplate<query_args_g, result_row_g>;
        items: query_args_g[];
      }) {
        // console.log({ flush_len: params.items.length });
        await params.extra.execute({ args_array: params.items });
      }
    });
  }

  async bufferedExecute(params: {
    args_array?: Array<query_args_g>;
  }): Promise<null | Array<result_row_g>> {
    const query_template_ref = this;
    if (!params.args_array) return null;
    await query_template_ref.buffered_array?.addMany(params.args_array);

    return null;
  }

  // this is the actual execute method which will be called when either the buffered stack hits
  // it's length, or the timer expires.
  async execute(params?: {
    args_array?: Array<query_args_g>;
  }): Promise<null | Array<result_row_g>> {
    const query_template_ref = this;

    if (!params) {
      return null;
    }

    if (!Array.isArray(params.args_array)) return null;
    if (params.args_array.length <= 0) return null;
    if (!Array.isArray(params.args_array[0])) return null;

    // these are the ? placeholders
    const stacked_query_placeholders: Array<string> = [];
    // this is the actual linear array of arguments
    const arg_stack: Array<any> = [];

    // iterate through argument rows and create our stacked query
    for (let outer_idx = 0; outer_idx < params.args_array.length; outer_idx++) {
      if (!Array.isArray(params.args_array[outer_idx])) return null;

      const inner_arr = params.args_array[outer_idx] as Array<any>;
      const stacked_set_str = Array(inner_arr.length).fill('?').join(', ');
      for (let data_idx = 0; data_idx < inner_arr.length; data_idx++) {
        arg_stack.push(inner_arr[data_idx]);
      }
      stacked_query_placeholders.push(`( ${stacked_set_str})`);
    }

    // if there's nothing to insert, just return immediately
    if (stacked_query_placeholders.length <= 0) return null;
    const placeholder_joined_string = stacked_query_placeholders.join(', ');

    // generate the final query
    let final_query =
      query_template_ref.query_insert_and_columns +
      ' VALUES ' +
      placeholder_joined_string;
    if (query_template_ref.trailing_clause)
      final_query += ' ' + query_template_ref.trailing_clause;

    const conn = await query_template_ref.pool.pool.getConnection();
    const query_result_data = await conn.execute(final_query, arg_stack);
    if (!query_result_data) return null;
    if (!query_result_data[0]) return null;
    if (!Array.isArray(query_result_data[0]))
      return [query_result_data[0]] as Array<result_row_g>;
    return query_result_data[0] as Array<result_row_g>;
  }
}
