import test from 'node:test';
import assert from 'node:assert';
import { MongoDB } from '@src/index';
import { ChangeStream, ChangeStreamDocument, Document } from 'mongodb';

import type {
  coll_change_stream_handler_t,
  db_change_stream_handler_t
} from '@src/index';
import { createReadStream } from 'node:fs';

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Test Definitions %%%%%%%%%%%%%%%%%%%%%%%
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
  const db_name = 'test_db';
  const collection_name = 'test_collection';
  const gfs_bucket_name = 'test_file_content_bucket';

  // Single big test case for all mongodb tests.
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
    const ping_response = await mongodb_client.MongoClient.db('admin').command({
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

    // create a new database
    const db_created_ok = await mongodb_client.createDatabase({
      name: db_name,
      info: { description: 'any description' }
    });
    assert.ok(db_created_ok, 'Database creation failed.');

    // ensure the test database exists
    assert.ok(
      await mongodb_client.databaseExists('test_db'),
      'Database does not exist.'
    );

    // create a collection
    await mongodb_client.createCollection({
      db: db_name,
      collection: collection_name
    });

    // ensure the collection exists
    assert.ok(
      await mongodb_client.collectionExists(db_name, collection_name),
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
        // switch on the operation type
        switch (change_event.operationType) {
          case 'insert':
            console.log('Insert detected.');
            break;
          case 'update':
            console.log('Update detected.');
            break;
          default:
            break;
        }
      }
    }

    // create handler instance
    const coll_change_stream_event_handler =
      new ArbitraryCollectionEventHandlerClassName();

    // create event listener
    await mongodb_client.subscribeToCollectionChangeStream({
      db: db_name,
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

        // switch on the operation type
        switch (change_event.operationType) {
          case 'drop':
            console.log('Drop detected.');
            break;
          case 'dropDatabase':
            console.log('Drop database detected.');
            break;
          default:
            break;
        }
      }
    }

    // create handler instance
    const db_change_stream_event_handler =
      new ArbitraryDatabaseEventHandlerClassName();

    // create event listener
    await mongodb_client.subscribeToDatabaseChangeStream({
      db: db_name,
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
      db: db_name,
      collection: collection_name,
      spec: test_index_spec
    });
    assert(!index_already_exists_check);

    // attempt to create index
    await mongodb_client.createIndexOnCollection({
      db: db_name,
      collection: collection_name,
      unique: true,
      spec: test_index_spec
    });

    // index should exist after creation
    index_already_exists_check = await mongodb_client.indexAlreadyExists({
      db: db_name,
      collection: collection_name,
      spec: test_index_spec
    });
    assert(index_already_exists_check);

    // attempt to delete the index
    const deleted_index_ok = await mongodb_client.deleteIndexFromCollection({
      db: db_name,
      collection: collection_name,
      spec: test_index_spec
    });
    assert(deleted_index_ok);

    // index should not exist after deletion
    index_already_exists_check = await mongodb_client.indexAlreadyExists({
      db: db_name,
      collection: collection_name,
      spec: test_index_spec
    });
    assert(!index_already_exists_check);

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%% Insert/Update Tests %%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    // test insert single record
    const insert_one_result = await mongodb_client.insertSingleRecord({
      db: db_name,
      collection: collection_name,
      write_options: {
        ordered: true
      },
      record: { somekey: 'data0', otherkey: 1 }
    });
    assert(insert_one_result?.acknowledged);

    // insert many records
    const insert_many_result = await mongodb_client.insertRecords({
      db: db_name,
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

    // update a single record
    const update_one_result = await mongodb_client.updateSingleRecord({
      db: db_name,
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
      db: db_name,
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
      db: db_name,
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
      db: db_name,
      collection: collection_name,
      find: {
        otherkey: 2
      }
    });
    assert(single_record);

    // find multiple records and process them in a callback
    const find_many_records_cb_result = await mongodb_client.findRecords({
      db: db_name,
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
      db: db_name,
      collection: collection_name,
      find: {
        otherkey: 2
      }
    });
    assert(find_many_records_array_result?.length);

    // distinct values test
    const find_distinct_result = await mongodb_client.distinctValues({
      db: db_name,
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
      db: db_name,
      collection: collection_name,
      filter: {},
      options: { allowDiskUse: true }
    });
    assert(count_documents_result);

    // gather estimated document count
    const estimated_document_count_result =
      await mongodb_client.estimatedDocumentCount({
        db: db_name,
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
      db: db_name,
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
      db: db_name,
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
        db: db_name,
        collection: collection_name,
        sample_size_n: 3
      });
    assert(random_sample_as_array?.length);

    // run random sampling via callback
    let random_sample_via_callback_count = 0;
    await mongodb_client.randomSampleFromCollection({
      db: db_name,
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
    const delete_single_record_result = await mongodb_client.deleteSingleRecord(
      {
        db: db_name,
        collection: collection_name,
        find: {
          otherkey: 2
        }
      }
    );
    assert(delete_single_record_result);

    // multi delete test
    const delete_many_records_result = await mongodb_client.deleteRecords({
      db: db_name,
      collection: collection_name,
      find: {
        otherkey: 2
      }
    });
    assert(delete_many_records_result);

    // delete a collection
    const delete_collection_result = await mongodb_client.deleteCollection({
      db: db_name,
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
      db: db_name,
      bucket_name: gfs_bucket_name
    });
    assert(create_bucket_result);

    // delete bucket after creation test
    const delete_bucket_result = await mongodb_client.GFS_deleteBucket({
      db: db_name,
      bucket_name: gfs_bucket_name
    });
    assert(delete_bucket_result);

    // store file from buffer test 1
    let object_id = await mongodb_client.GFS_storeFileFromBuffer({
      db: db_name,
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
      db: db_name,
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
      db: db_name,
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
        db: db_name,
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
      db: db_name,
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
    const find_single_file_result = await mongodb_client.GFS_findSingleFileGFS({
      db: db_name,
      bucket_name: gfs_bucket_name,
      find: {
        'metadata.anything': 'herealso'
      }
    });
    assert(find_single_file_result);

    // find files with callback test
    let find_files_with_callback_result: boolean = false;
    await mongodb_client.GFS_findFiles({
      db: db_name,
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
      db: db_name,
      bucket_name: gfs_bucket_name,
      find: {
        'metadata.anything': 'here'
      }
    });
    assert(find_files_as_array_result?.length);

    // update single file metadata test
    const update_single_file_metadata_result =
      await mongodb_client.GFS_updateSingleFileMetadata({
        db: db_name,
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
        db: db_name,
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
    const delete_single_file_result = await mongodb_client.GFS_deleteSingleFile(
      {
        db: db_name,
        bucket_name: gfs_bucket_name,
        find: {
          'metadata.anything': 'here'
        }
      }
    );
    assert(delete_single_file_result);

    // delete files test (returns the number of files deleted)
    const deleted_file_count = await mongodb_client.GFS_deleteFiles({
      db: db_name,
      bucket_name: gfs_bucket_name,
      find: {
        'metadata.anything': 'here'
      }
    });
    assert(deleted_file_count !== -1);

    // delete the database
    const delete_database_result = await mongodb_client.deleteDatabase(db_name);
    assert(delete_database_result);

    // ensure the test database no longer exists
    assert(!(await mongodb_client.databaseExists(db_name)));

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
