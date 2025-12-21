// mongodb
import { MongoDB } from './classes/mongodb/MongoDB.class';
import type {
  coll_change_stream_handler_t,
  db_change_stream_handler_t
} from './classes/mongodb/MongoDB.class';

// mariadb
import {
  MariaDBSelectQueryModel,
  MariaDBSelectQueryError
} from './classes/mariadb/old/MariaDBSelectQueryModel.class';
import { MariaDB } from './classes/mariadb/MariaDB.class';
import type { mariadb_query_data_t } from './classes/mariadb/MariaDB.class';

// export data
export {
  // mongodb exports
  MongoDB,
  coll_change_stream_handler_t,
  db_change_stream_handler_t,
  // mariadb exports
  MariaDBSelectQueryModel,
  MariaDBSelectQueryError,
  MariaDB,
  mariadb_query_data_t
};
