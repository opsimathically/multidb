// we need both the promise and callback based mysql2 capabilities due to the fact
// that the mysql2/promise interface doesn't expose the callback/stream capabilities
// of the non-promise based code.  This is why there's a pool and sync_pool member
// wthin the pool class definition.
import { Pool, PoolOptions } from 'mysql2/promise';
import { Pool as CallbackPool } from 'mysql2';

import { MariaDBDatabaseSchemaIntrospector } from './MariaDBDatabaseSchemaIntrospector.class';
import { MariaDBSQLQueryValidator } from './MariaDBSQLQueryValidator.class';
import { DualIndexStore } from '../dualstore/DualIndexStore.class';
import { MariaDBQueryTemplate } from './MariaDBQueryTemplate.class';
import type { schema_snapshot_t } from './MariaDBDatabaseSchemaIntrospector.class';

export class MariaDBPool {
  name: string;
  db: string;
  pool: Pool;
  sync_pool: CallbackPool;
  pool_options: PoolOptions;
  schema_introspector: MariaDBDatabaseSchemaIntrospector;
  query_validator: MariaDBSQLQueryValidator;
  schema_snapshot: schema_snapshot_t;

  query_templates: DualIndexStore<MariaDBQueryTemplate<unknown, unknown>> =
    new DualIndexStore<MariaDBQueryTemplate<unknown, unknown>>();

  constructor(params: {
    name: string;
    db: string;
    pool: Pool;
    sync_pool: CallbackPool;
    pool_options: PoolOptions;
    schema_introspector: MariaDBDatabaseSchemaIntrospector;
    query_validator: MariaDBSQLQueryValidator;
    schema_snapshot: schema_snapshot_t;
  }) {
    this.name = params.name;
    this.db = params.db;
    this.pool = params.pool;
    this.sync_pool = params.sync_pool;
    this.pool_options = params.pool_options;
    this.schema_introspector = params.schema_introspector;
    this.query_validator = params.query_validator;
    this.schema_snapshot = params.schema_snapshot;
  }
}
