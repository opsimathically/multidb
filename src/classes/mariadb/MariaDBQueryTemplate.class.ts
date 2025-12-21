import mysql, { PoolConnection } from 'mysql2';
import { MariaDBPool } from './MariaDBPool.class';

export type QueryTemplateRow = Record<string, any>;

export class MariaDBQueryTemplate<query_args_g, result_row_g> {
  query: string;
  db: string;
  pool: MariaDBPool;
  sha1: string;
  constructor(params: {
    query: string;
    db: string;
    pool: MariaDBPool;
    sha1: string;
  }) {
    this.query = params.query;
    this.db = params.db;
    this.pool = params.pool;
    this.sha1 = params.sha1;
  }

  async execute(params?: {
    args?: query_args_g;
    cb?: (params: {
      header: mysql.ResultSetHeader;
      row: result_row_g /*mysql.RowDataPacket*/;
      index: number;
    }) => Promise<void | 'breakloop'>;
  }): Promise<null | Array<result_row_g>> {
    const query_template_ref = this;

    if (!params) {
      params = {
        args: [] as query_args_g
      };
    }

    if (!params.args) params.args = [] as query_args_g;

    // use promises based query if we have no callback
    if (!params.cb) {
      const conn = await query_template_ref.pool.pool.getConnection();
      const query_result_data = await conn.execute(
        query_template_ref.query,
        params.args
      );
      if (!query_result_data) return null;
      if (!query_result_data[0]) return null;
      if (!Array.isArray(query_result_data[0]))
        return [query_result_data[0]] as Array<result_row_g>;
      return query_result_data[0] as Array<result_row_g>;
    } else {
      const conn: PoolConnection | null = await new Promise(
        (resolve, reject) => {
          query_template_ref.pool.sync_pool.getConnection((err, c) =>
            err ? reject(err) : resolve(c)
          );
        }
      );

      if (!conn) {
        debugger;
        return null;
      }

      await new Promise<void>((resolve, reject) => {
        const q = conn.query(query_template_ref.query, params.args);
        let row_header: mysql.ResultSetHeader | mysql.RowDataPacket | null =
          null;
        let done: boolean = false;
        // handle error
        q.on('error', (err) => {
          conn.release();
          reject(err);
        });

        q.on(
          'result',
          async (
            row: mysql.RowDataPacket | mysql.ResultSetHeader,
            index: number
          ) => {
            if (!params.cb) {
              debugger;
              return;
            }
            // Backpressure: pause the socket/parser while we process this row
            conn.pause(); // pattern used for streaming in mysql2 :contentReference[oaicite:3]{index=3}

            if (index <= 0) row_header = row;

            let cb_result: undefined | void | 'breakloop';
            if (row_header) {
              try {
                cb_result = await params.cb({
                  row: row as result_row_g /*mysql.RowDataPacket*/,
                  header: row_header as mysql.ResultSetHeader,
                  index: index
                });
              } catch (e) {
                debugger;
                conn.destroy();
                reject(e);
              }

              if (cb_result === 'breakloop') {
                done = true;
                conn.destroy();
                resolve();
                return;
              }
            }
            conn.resume();
          }
        );

        q.on('end', () => {
          if (done) return;
          conn.release();
          resolve();
        });
      });
    }

    // just return null since we're using the callback version
    return null;
  }
}
