export type mariadb_catlayer_t =
  | 'NOCAT'
  | 'POOL'
  | 'DDL'
  | 'DML'
  | 'DCL'
  | 'TCL';

export class MariaDBError extends Error {
  data: {
    code: number;
    type: string;
    category: mariadb_catlayer_t;
    msg: string;
    extra?: any;
  } = {
    code: -1,
    type: 'NOTYPE',
    category: 'NOCAT',
    msg: 'NOMSG'
  };

  constructor(params: {
    msg: string;
    type: string;
    category: mariadb_catlayer_t;
    code: number;
    extra?: any;
  }) {
    super(params.msg);
    this.data = params;
  }
}
