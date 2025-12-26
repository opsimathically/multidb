import test from 'node:test';
import assert from 'node:assert';
import fs_promises from 'fs/promises';
import type { ChangeStream, ChangeStreamDocument, Document } from 'mongodb';

import {
  MongoDB,
  MongoDBBufferedStackedInsert,
  MariaDBDumpImporter,
  MariaDBDumpExporter,
  MariaDB,
  MariaDBDatabaseSchemaIntrospector,
  MariaDBSQLQueryValidator
} from '@src/index';

import type {
  coll_change_stream_handler_t,
  db_change_stream_handler_t
} from '@src/index';

import { createReadStream } from 'node:fs';

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Configurations %%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

(async function () {
  // define test credentials
  const test_credentials = {
    host: '127.0.0.1',
    username: 'your_test_user',
    authdb: 'admin',
    replicaSet: 'rs0',
    password: 'SET_YOUR_TEST_PASSWORD_HERE',
    port: 27017
  };

  // define db/collection/gfs bucket
  const mongo_test_db_name = 'mongo_unit_test_db_1000';
  const collection_name = 'test_collection';
  const gfs_bucket_name = 'test_file_content_bucket';

  const mariadb_pool_config_1 = {
    connectionLimit: 500,
    waitForConnections: true,
    queueLimit: 65535,
    host: '127.0.0.1',
    user: 'your_mariadb_user',
    password: 'your_mariadb_password!',
    debug: false,
    insecureAuth: true
  };

  const mariadb_adminpool_config_1 = {
    connectionLimit: 500,
    waitForConnections: true,
    queueLimit: 65535,
    host: '127.0.0.1',
    user: 'your_mariadb_user',
    password: 'your_mariadb_password!',
    debug: false,
    insecureAuth: true
  };

  /*
  # Create the user with a strong password
  CREATE USER 'test_user'@'localhost'
    IDENTIFIED BY 'Some_Very_Strong_Password_Gitub_Bot_Stop_Saying_This_Is_My_Password_123!';

  # Give them full privileges on *all* databases and tables
  GRANT ALL PRIVILEGES ON *.* TO 'test_user'@'localhost'
    WITH GRANT OPTION;

  #Reload privilege tables (older habit, harmless to run)
  FLUSH PRIVILEGES;
  */

  const mariadb_tests_enabled = true;
  const mongo_tests_enabled = true;

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MariaDB Tests %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  if (mariadb_tests_enabled)
    test('MariaDB tests.', async function () {
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Run Administrative Tasks %%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      const mariadb_client = new MariaDB();

      await mariadb_client.addAdminPool({
        name: 'db1_adminpool1',
        pool_options: mariadb_adminpool_config_1
      });

      await mariadb_client.dropDatabaseIfExists({
        adminpool: 'db1_adminpool1',
        db: 'unit_test_db_1000'
      });

      await mariadb_client.createDatabaseIfNotExists({
        adminpool: 'db1_adminpool1',
        db: 'unit_test_db_1000'
      });

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Import Schema From File %%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      const importer = new MariaDBDumpImporter({
        mysql_bin_path: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        user: 'your_mariadb_user',
        password: 'your_mariadb_password!',
        database: 'unit_test_db_1000',
        default_character_set: 'utf8mb4',
        use_mysql_pwd_env: true,
        connect_timeout_seconds: 10
      });

      const result = await importer.importFile(
        './test/sqldumps_used_by_test/testdb.sql'
      );
      assert.ok(result?.exit_code === 0, 'Importing SQL schema failed.');

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Run Exporter Test %%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // MariaDBDumpExporter
      const exporter = new MariaDBDumpExporter({
        host: '127.0.0.1',
        port: 3306,
        user: 'your_mariadb_user',
        password: 'your_mariadb_password!',
        database: 'unit_test_db_1000',
        output_file_path: '/tmp/unit_test_db_export_test.sql',
        extra_args: [
          '--single-transaction',
          '--quick',
          '--routines',
          '--events'
        ]
      });

      const export_db_result = await exporter.exportDatabase();
      assert.ok(export_db_result.exit_code === 0, 'DB export failed.');
      const export_stat_result = await fs_promises.stat(
        '/tmp/unit_test_db_export_test.sql'
      );

      assert.ok(
        export_db_result.dumped_bytes === export_stat_result.size,
        'Dump size mismatch on dumped file stat vs. export.'
      );

      // cleanup the test dump file
      await fs_promises.unlink('/tmp/unit_test_db_export_test.sql');

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Run Introspector/Validator Tests %%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // create new introspector
      const introspector = new MariaDBDatabaseSchemaIntrospector(
        mariadb_pool_config_1,
        { load_check_clauses: true, load_view_definitions: true }
      );

      // create snapshot of the schema
      const schema_snapshot =
        await introspector.load_database_schema('unit_test_db_1000');
      await introspector.close();

      // create query validator
      const query_validator = new MariaDBSQLQueryValidator(schema_snapshot);

      // test validator
      const validation_result = query_validator.validate(
        'SELECT id FROM new_table WHERE id = 1'
      );
      assert.ok(validation_result.ok, 'Query validation failed.');

      // test validator again
      const validation_result2 = query_validator.validate(
        'SELECT id as bad_val FROM new_table WHERE id = 1'
      );
      assert.ok(!validation_result2.ok, 'Query invalidation failed.');

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Add Database Specific Pool %%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      await mariadb_client.addPool({
        name: 'db1_pool1',
        db: 'unit_test_db_1000',
        pool_options: mariadb_pool_config_1
      });

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Basic Stacked Queries %%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      const stacked_insert = await mariadb_client.addStackedInsertQuery<
        [string, string]
      >({
        pool: 'db1_pool1',
        db: 'unit_test_db_1000',
        name: 'testInsertQuery',
        query_insert_and_columns: `INSERT INTO unit_test_db_1000.new_table  ( column_1, column_2 )`,
        expected_value_set_count: 2
      });

      await stacked_insert?.execute({
        args_array: [
          ['hello1', 'hello2'],
          ['hello3', 'hello4'],
          ['hello5', 'hello6']
        ]
      });

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Buffered Stacked Query %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      const buffered_stacked_insert =
        await mariadb_client.addBufferedStackedInsertQuery<[string, string]>({
          pool: 'db1_pool1',
          db: 'unit_test_db_1000',
          name: 'testInsertQuery',
          query_insert_and_columns: `INSERT INTO unit_test_db_1000.new_table  ( column_1, column_2 )`,
          expected_value_set_count: 2,
          max_timeout_for_insert_when_no_new_records_ms: 1000,
          max_rows_before_insert_len: 10
        });

      assert(
        buffered_stacked_insert,
        'Failed to create buffered stacked insert.'
      );

      await buffered_stacked_insert.bufferedExecute({
        args_array: [
          ['hello1', 'hello2'],
          ['hello3', 'hello4'],
          ['hello5', 'hello6']
        ]
      });

      await buffered_stacked_insert.bufferedExecute({
        args_array: [
          ['hello7', 'hello8'],
          ['hello9', 'hello10'],
          ['hello11', 'hello12'],
          ['hello13', 'hello14']
        ]
      });

      // create 100 deep array to test stacked inserts
      const long_insert_array = new Array<[string, string]>(100).fill([
        'hello_long',
        'also_long'
      ]);

      await buffered_stacked_insert.bufferedExecute({
        args_array: long_insert_array
      });

      if (buffered_stacked_insert.buffered_array?.getSize()) {
        await buffered_stacked_insert.buffered_array?.flushNow();
      }

      await buffered_stacked_insert.bufferedExecute({
        args_array: long_insert_array
      });

      const count_query = await mariadb_client.addQuery<
        null,
        { row_count: number }
      >({
        pool: 'db1_pool1',
        db: 'unit_test_db_1000',
        name: 'countNewTable',
        query: `select count(id) as row_count from unit_test_db_1000.new_table`,
        // test skipping validation since we're renaming count(id) and that's typically
        // invalid/forbidden.
        skip_validator: true
      });

      const count_result = await count_query?.execute();

      if (count_result) {
        if (count_result[0]) {
          assert.ok(
            count_result[0].row_count ===
              buffered_stacked_insert.buffered_array.flush_info
                .total_flushed_cnt +
                3,
            `The new_table count was an unexpected length (${count_result[0].row_count} found but ${buffered_stacked_insert.buffered_array.flush_info.total_flushed_cnt} was counted)`
          );
        }
      }

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Select Queries %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      type select_row_example_t = {
        id: number;
        column_1: string;
        column_2: string;
      };

      const select_query = await mariadb_client.addQuery<
        null,
        select_row_example_t
      >({
        pool: 'db1_pool1',
        db: 'unit_test_db_1000',
        name: 'selectRecords',
        query: `SELECT * FROM unit_test_db_1000.new_table;`
      });

      assert.ok(select_query, 'No select query created.');

      let row_iter_n = 0;
      await select_query.execute({
        args: null,
        cb: async (params) => {
          if (row_iter_n === 5 && params.row.column_1 === 'hello5') {
            return 'breakloop';
          }
          row_iter_n++;
        }
      });

      assert.ok(row_iter_n === 5, 'Row iteration count mismatch.');

      const all_rows_for_query = await select_query.execute();

      assert.ok(Array.isArray(all_rows_for_query), 'Result was not an array.');
      assert.ok(
        all_rows_for_query.length === 210,
        `Row count mismatch, should be 210 but was ${all_rows_for_query.length}.`
      );

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Cleanup/Shutdown Pools %%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // remove the unit test database
      await mariadb_client.dropDatabaseIfExists({
        adminpool: 'db1_adminpool1',
        db: 'unit_test_db_1000'
      });

      const shutdown_ok = await mariadb_client.shutdown({
        admin_pools: true,
        standard_pools: true
      });
      assert(shutdown_ok === true, 'Failed to shutdown all db pools.');
    });

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% MongoDB Tests %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Single big test case for all mongodb tests.
  if (mongo_tests_enabled)
    test('MongoDB tests.', async function () {
      const mongodb_client = new MongoDB();
      const connected_ok = await mongodb_client.connect(test_credentials);

      // fail if we could not connect ok
      if (connected_ok !== true) {
        debugger;
        return;
      }

      // ensure we have a client present
      assert.ok(
        mongodb_client.MongoClient,
        "We don't have a MongoClient available."
      );

      // attempt to ping admin database
      const ping_response = await mongodb_client.MongoClient.db(
        'admin'
      ).command({
        ping: 1
      });

      // ensure the ping response matches
      assert.ok(ping_response.ok === 1, 'Could not ping admin database');

      // ensure we can gather databases
      const databases = await mongodb_client.gatherDatabasesAndCollections();
      assert.ok(databases, 'Could not gather databases.');

      // run single database check
      assert.ok(
        await mongodb_client.databaseExists('admin'),
        'Admin database does not exist.'
      );

      // if our test database already exists, delete it first
      if (await mongodb_client.databaseExists(mongo_test_db_name)) {
        await mongodb_client.deleteDatabase(mongo_test_db_name);
      }

      // create a new database
      const db_created_ok = await mongodb_client.createDatabase({
        name: mongo_test_db_name,
        info: { description: 'any description' }
      });
      assert.ok(db_created_ok, 'Database creation failed.');

      // ensure the test database exists
      assert.ok(
        await mongodb_client.databaseExists(mongo_test_db_name),
        'Database does not exist.'
      );

      // create a collection
      await mongodb_client.createCollection({
        db: mongo_test_db_name,
        collection: collection_name
      });

      // ensure the collection exists
      assert.ok(
        await mongodb_client.collectionExists(
          mongo_test_db_name,
          collection_name
        ),
        'Collection does not exist.'
      );

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Monitor Collection Change Stream %%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // Change stream callbacks are handled via a change stream handler.  We do this
      // to make it easier to pass data through to the handlers application logic.
      class ArbitraryCollectionEventHandlerClassName
        implements coll_change_stream_handler_t
      {
        // custom elements
        arbitrary_activation_count: number = 0;

        // mandatory interface implementations
        mongodb_ref: MongoDB | undefined;
        db: string | undefined;
        collection: string | undefined;
        change_stream:
          | ChangeStream<Document, ChangeStreamDocument<Document>>
          | undefined;

        // class constructor
        constructor() {}

        // event processor
        async onChange(change_event: ChangeStreamDocument<Document>) {
          const self_ref = this;
          self_ref.arbitrary_activation_count++;

          if (change_event.operationType) {
            // uncomment to debug
            // console.log('Collection Event: ' + change_event.operationType);
          }
        }
      }

      // create handler instance
      const coll_change_stream_event_handler =
        new ArbitraryCollectionEventHandlerClassName();

      // create event listener
      await mongodb_client.subscribeToCollectionChangeStream({
        db: mongo_test_db_name,
        collection: collection_name,
        event_handler: coll_change_stream_event_handler
      });

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Monitor Database Change Stream %%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // Change stream callbacks are handled via a change stream handler.  We do this
      // to make it easier to pass data through to the handlers application logic.
      class ArbitraryDatabaseEventHandlerClassName
        implements db_change_stream_handler_t
      {
        // custom elements
        arbitrary_activation_count: number = 0;

        // mandatory interface implementations
        mongodb_ref: MongoDB | undefined;
        db: string | undefined;
        change_stream:
          | ChangeStream<Document, ChangeStreamDocument<Document>>
          | undefined;

        // class constructor
        constructor() {}

        // event processor
        async onChange(change_event: ChangeStreamDocument<Document>) {
          const self_ref = this;
          self_ref.arbitrary_activation_count++;

          if (change_event.operationType) {
            // uncomment to debug
            // console.log('DB Event: ' + change_event.operationType);
          }
        }
      }

      // create handler instance
      const db_change_stream_event_handler =
        new ArbitraryDatabaseEventHandlerClassName();

      // create event listener
      await mongodb_client.subscribeToDatabaseChangeStream({
        db: mongo_test_db_name,
        event_handler: db_change_stream_event_handler
      });

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Indexing Tests %%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // create an index specification
      const test_index_spec = {
        somekey: 1
      };

      // index should not exist before creation
      let index_already_exists_check = await mongodb_client.indexAlreadyExists({
        db: mongo_test_db_name,
        collection: collection_name,
        spec: test_index_spec
      });
      assert(!index_already_exists_check);

      // attempt to create index
      await mongodb_client.createIndexOnCollection({
        db: mongo_test_db_name,
        collection: collection_name,
        unique: true,
        spec: test_index_spec
      });

      // index should exist after creation
      index_already_exists_check = await mongodb_client.indexAlreadyExists({
        db: mongo_test_db_name,
        collection: collection_name,
        spec: test_index_spec
      });
      assert(index_already_exists_check);

      // attempt to delete the index
      const deleted_index_ok = await mongodb_client.deleteIndexFromCollection({
        db: mongo_test_db_name,
        collection: collection_name,
        spec: test_index_spec
      });
      assert(deleted_index_ok);

      // index should not exist after deletion
      index_already_exists_check = await mongodb_client.indexAlreadyExists({
        db: mongo_test_db_name,
        collection: collection_name,
        spec: test_index_spec
      });
      assert(!index_already_exists_check);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Insert/Update Tests %%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // test insert single record
      const insert_one_result = await mongodb_client.insertSingleRecord({
        db: mongo_test_db_name,
        collection: collection_name,
        write_options: {
          ordered: true
        },
        record: { somekey: 'data0', otherkey: 1 }
      });
      assert(insert_one_result?.acknowledged);

      // insert many records
      const insert_many_result = await mongodb_client.insertRecords({
        db: mongo_test_db_name,
        collection: collection_name,
        write_options: {
          ordered: true
        },
        records: [
          { somekey: 'data1', otherkey: 1 },
          { somekey: 'data2', otherkey: 1 },
          { somekey: 'data3', otherkey: 1 },
          { somekey: 'data4', otherkey: 1 }
        ]
      });
      assert(insert_many_result?.acknowledged);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Buffered Stacked Insert Tests %%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // we set the interval ms to 0 to immediately flush records if there are
      // any dangling.
      const mongo_stacked_insert = new MongoDBBufferedStackedInsert({
        db: mongo_test_db_name,
        collection: collection_name,
        interval_ms: 0,
        max_length: 10,
        mongodb_client: mongodb_client,
        write_options: {
          ordered: true
        }
      });

      // don't use Array.fill here since somekey has a unique index on it
      let buffered_insert_test_array = [];
      for (let idx = 0; idx < 200; idx++) {
        buffered_insert_test_array.push({
          somekey: 'test-data' + idx,
          otherkey: 4
        });
      }

      await mongo_stacked_insert.bufferedInsert({
        records: buffered_insert_test_array
      });

      // reassign data with unaligned data
      buffered_insert_test_array = [];
      for (let idx = 0; idx < 123; idx++) {
        buffered_insert_test_array.push({
          somekey: 'other-test-data' + idx,
          otherkey: 4
        });
      }

      await mongo_stacked_insert.bufferedInsert({
        records: buffered_insert_test_array
      });

      assert.ok(
        mongo_stacked_insert.buffered_array.flush_info.total_flushed_cnt ===
          323,
        `Flush count does not match the expecte record count (cnt: ${mongo_stacked_insert.buffered_array.flush_info.total_flushed_cnt}).`
      );

      // count documents exactly
      const stacked_inserted_count = await mongodb_client.countDocuments({
        db: mongo_test_db_name,
        collection: collection_name,
        filter: {},
        options: { allowDiskUse: true }
      });
      assert.ok(
        stacked_inserted_count === 328,
        `Record count was supposed to be 328 but was ${stacked_inserted_count}`
      );

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Update Tests %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // update a single record
      const update_one_result = await mongodb_client.updateSingleRecord({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          somekey: 'data0'
        },
        update: {
          $set: { somekey: 'UPDATED!' }
        }
      });
      assert(update_one_result?.acknowledged);

      // update many test
      const update_many_result = await mongodb_client.updateRecords({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          otherkey: 1
        },
        update: {
          $set: { otherkey: 2 }
        }
      });
      assert(update_many_result?.acknowledged);

      // upsert single record test
      const upsert_one_result = await mongodb_client.updateSingleRecord({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          otherkey: 3
        },
        update: {
          $set: { somekey: 'data5', otherkey: 3 }
        },
        update_options: {
          upsert: true
        }
      });
      assert(upsert_one_result?.acknowledged);
      assert(upsert_one_result?.upsertedCount > 0);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Find Tests %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // find a single record
      const single_record = await mongodb_client.findSingleRecord({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          otherkey: 2
        }
      });
      assert(single_record);

      // find multiple records and process them in a callback
      const find_many_records_cb_result = await mongodb_client.findRecords({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          otherkey: 2
        },
        cb: async function (cb_params) {
          if (cb_params) return 'breakloop';
        }
      });
      assert(find_many_records_cb_result);
      assert(!find_many_records_cb_result.length);

      // run the find again but this time return the results as an array
      const find_many_records_array_result = await mongodb_client.findRecords({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          otherkey: 2
        }
      });
      assert(find_many_records_array_result?.length);

      // distinct values test
      const find_distinct_result = await mongodb_client.distinctValues({
        db: mongo_test_db_name,
        collection: collection_name,
        key: 'otherkey',
        find: {},
        options: {}
      });
      assert(find_distinct_result?.length);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Document Counts %%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // count documents exactly
      const count_documents_result = await mongodb_client.countDocuments({
        db: mongo_test_db_name,
        collection: collection_name,
        filter: {},
        options: { allowDiskUse: true }
      });
      assert(count_documents_result);

      // gather estimated document count
      const estimated_document_count_result =
        await mongodb_client.estimatedDocumentCount({
          db: mongo_test_db_name,
          collection: collection_name,
          options: {
            maxTimeMS: 50000
          }
        });
      assert(estimated_document_count_result);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Aggregation Tests %%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // aggregate collection records using callback
      let aggregation_coll_count = 0;
      await mongodb_client.aggregateCollection({
        db: mongo_test_db_name,
        collection: collection_name,
        pipeline: [
          {
            $match: {}
          }
        ],
        cb: async function (params) {
          if (params) {
            aggregation_coll_count++;
          }
        }
      });
      assert(aggregation_coll_count > 0);

      // aggregate collection records to array
      const aggregate_coll_as_array = await mongodb_client.aggregateCollection({
        db: mongo_test_db_name,
        collection: collection_name,
        pipeline: [
          {
            $match: {}
          }
        ]
      });
      assert(Array.isArray(aggregate_coll_as_array));

      // aggregate db records using callback
      let op_count = 0;
      await mongodb_client.aggregateDB({
        db: 'admin',
        pipeline: [
          {
            $currentOp: {
              allUsers: true,
              idleConnections: true,
              idleCursors: true,
              idleSessions: true,
              localOps: true
            }
          }
        ],
        cb: async function (params) {
          if (params) op_count++;
        }
      });
      assert(op_count);

      // aggregate db using toArray
      const aggreate_db_to_array = await mongodb_client.aggregateDB({
        db: 'admin',
        pipeline: [
          {
            $currentOp: {
              allUsers: true,
              idleConnections: true,
              idleCursors: true,
              idleSessions: true,
              localOps: true
            }
          }
        ]
      });
      assert(Array.isArray(aggreate_db_to_array));

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Random Sampling %%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      const random_sample_as_array =
        await mongodb_client.randomSampleFromCollection({
          db: mongo_test_db_name,
          collection: collection_name,
          sample_size_n: 3
        });
      assert(random_sample_as_array?.length);

      // run random sampling via callback
      let random_sample_via_callback_count = 0;
      await mongodb_client.randomSampleFromCollection({
        db: mongo_test_db_name,
        collection: collection_name,
        sample_size_n: 3,
        cb: async function (params) {
          if (params) random_sample_via_callback_count++;
        }
      });
      assert(random_sample_via_callback_count);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Deletions %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // delete the first matching single record
      const delete_single_record_result =
        await mongodb_client.deleteSingleRecord({
          db: mongo_test_db_name,
          collection: collection_name,
          find: {
            otherkey: 2
          }
        });
      assert(delete_single_record_result);

      // multi delete test
      const delete_many_records_result = await mongodb_client.deleteRecords({
        db: mongo_test_db_name,
        collection: collection_name,
        find: {
          otherkey: 2
        }
      });
      assert(delete_many_records_result);

      // delete a collection
      const delete_collection_result = await mongodb_client.deleteCollection({
        db: mongo_test_db_name,
        collection: collection_name
      });
      assert(delete_collection_result);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% GridFS Tests %%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // GridFS is a binary storage engine that attaches metadata records to backend
      // binary content.
      //
      // GridFS can search through metadata, but not file content.
      // GridFS can update metadata, but not file content.

      // create bucket test
      const create_bucket_result = await mongodb_client.GFS_createBucket({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name
      });
      assert(create_bucket_result);

      // delete bucket after creation test
      const delete_bucket_result = await mongodb_client.GFS_deleteBucket({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name
      });
      assert(delete_bucket_result);

      // store file from buffer test 1
      let object_id = await mongodb_client.GFS_storeFileFromBuffer({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        file_content_buffer: Buffer.from('AAAAAAAAA', 'ascii'),
        file_metadata: {
          some: 'metadata',
          anything: 'here'
        },
        filename: 'any_filename_here.txt'
      });
      assert(object_id);

      // store file from buffer test 2
      object_id = await mongodb_client.GFS_storeFileFromBuffer({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        file_content_buffer: Buffer.from('BBBBBBBBB', 'ascii'),
        file_metadata: {
          some: 'metadata',
          anything: 'here'
        },
        filename: 'any_filename_here2.txt'
      });
      assert(object_id);

      // store file from buffer test 3
      object_id = await mongodb_client.GFS_storeFileFromBuffer({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        file_content_buffer: Buffer.from('CCCCCCCC', 'ascii'),
        file_metadata: {
          some: 'metadata',
          anything: 'here'
        },
        filename: 'any_filename_here3.txt'
      });
      assert(object_id);

      // store file from stream test
      const store_from_stream_object_id =
        await mongodb_client.GFS_storeFileFromStream({
          db: mongo_test_db_name,
          bucket_name: gfs_bucket_name,
          file_content_stream: createReadStream(
            './test/files_used_by_test/test_file_1.txt'
          ),
          file_metadata: {
            some: 'othermetadata',
            anything: 'herealso'
          },
          filename: 'from_stream_filename.txt'
        });
      assert(store_from_stream_object_id);

      // find single file using cb test
      let find_single_file_using_cb_result = false;
      await mongodb_client.GFS_findSingleFileGFS({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        find: {
          'metadata.anything': 'herealso'
        },
        cb: async function (params) {
          if (params) find_single_file_using_cb_result = true;
        }
      });
      assert(find_single_file_using_cb_result);

      // find/download a single file without using callback test
      const find_single_file_result =
        await mongodb_client.GFS_findSingleFileGFS({
          db: mongo_test_db_name,
          bucket_name: gfs_bucket_name,
          find: {
            'metadata.anything': 'herealso'
          }
        });
      assert(find_single_file_result);

      // find files with callback test
      let find_files_with_callback_result: boolean = false;
      await mongodb_client.GFS_findFiles({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        find: {
          'metadata.anything': 'here'
        },
        cb: async function (params) {
          if (params) find_files_with_callback_result = true;
        }
      });
      assert(find_files_with_callback_result);

      // find files as array test
      const find_files_as_array_result = await mongodb_client.GFS_findFiles({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        find: {
          'metadata.anything': 'here'
        }
      });
      assert(find_files_as_array_result?.length);

      // update single file metadata test
      const update_single_file_metadata_result =
        await mongodb_client.GFS_updateSingleFileMetadata({
          db: mongo_test_db_name,
          bucket_name: gfs_bucket_name,
          find: {
            'metadata.anything': 'herealso'
          },
          update: {
            $set: { 'metadata.moo': 'anyvalue' }
          }
        });
      assert(update_single_file_metadata_result);

      // update multiple file metadata test
      const update_multi_file_metadata_result =
        await mongodb_client.GFS_updateFilesMetadata({
          db: mongo_test_db_name,
          bucket_name: gfs_bucket_name,
          find: {
            'metadata.anything': 'herealso'
          },
          update: {
            $set: { 'metadata.moo': 'anyvalue' }
          }
        });
      assert(update_multi_file_metadata_result);

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%% Deletion Tests %%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      // delete single file test
      const delete_single_file_result =
        await mongodb_client.GFS_deleteSingleFile({
          db: mongo_test_db_name,
          bucket_name: gfs_bucket_name,
          find: {
            'metadata.anything': 'here'
          }
        });
      assert(delete_single_file_result);

      // delete files test (returns the number of files deleted)
      const deleted_file_count = await mongodb_client.GFS_deleteFiles({
        db: mongo_test_db_name,
        bucket_name: gfs_bucket_name,
        find: {
          'metadata.anything': 'here'
        }
      });
      assert(deleted_file_count !== -1);

      // delete the database
      const delete_database_result =
        await mongodb_client.deleteDatabase(mongo_test_db_name);
      assert(delete_database_result);

      // ensure the test database no longer exists
      assert(!(await mongodb_client.databaseExists(mongo_test_db_name)));

      // ensure we've seen some event activations via stream by the time we've gotten here
      assert.ok(
        coll_change_stream_event_handler.arbitrary_activation_count,
        'Failed to detect any events via collection change stream event handler.'
      );
      assert.ok(
        db_change_stream_event_handler.arbitrary_activation_count,
        'Failed to detect any events via database change stream event handler.'
      );

      // disconnect the client
      await mongodb_client.disconnect();
      assert(mongodb_client.MongoClient === null);
    });
})();
