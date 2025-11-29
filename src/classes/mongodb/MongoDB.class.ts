import {
  MongoClient,
  Db,
  Collection,
  OptionalId,
  Document,
  InsertManyResult,
  InsertOneResult,
  UpdateResult,
  IndexSpecification,
  Filter,
  UpdateFilter,
  FindOptions,
  FindCursor,
  WithId,
  GridFSBucket,
  GridFSBucketWriteStream,
  ObjectId,
  AggregateOptions,
  AggregationCursor,
  BulkWriteOptions,
  UpdateOptions,
  DistinctOptions,
  CountDocumentsOptions,
  EstimatedDocumentCountOptions,
  DeleteResult
} from 'mongodb';

import crypto from 'crypto';
import { Readable } from 'stream';
import { MongoDBStreamHash } from './MongoDBStreamHash.class';

export type mongodb_databases_t = Record<string, Record<string, boolean>>;

export type file_data_t = {
  file_doc: Document;
  buff: Buffer;
} | null;

// hash a string or buffer
function sha1(input: string | Buffer): string {
  return crypto.createHash('sha1').update(input).digest('hex');
}

export class MongoDB {
  MongoClient: MongoClient | null = null;
  known_indexes: Record<string, boolean> = {};
  constructor() {}

  // connect to a mongodb server
  async connect(params: {
    host: string;
    username: string;
    authdb: string;
    password: string;
    port: number;
    maxPoolSize?: number | undefined;
    tls?: boolean | undefined;
    tlsInsecure?: boolean | undefined;
  }) {
    // set self reference
    const mongodb_ref = this;

    // set the connect URI
    let connect_uri = `mongodb://${params.username}:${params.password}@${params.host}:${params.port}/user-data?authSource=${params.authdb}`;

    // add tls flags
    if (params.tls === true) connect_uri += '&tls=true';
    if (params.tlsInsecure === true) connect_uri += '&tlsInsecure=true';

    // add connection pool size if present
    if (Number.isInteger(params.maxPoolSize) === true)
      connect_uri += '&maxPoolSize=' + params.maxPoolSize;

    // create new mongodb client
    mongodb_ref.MongoClient = new MongoClient(connect_uri);

    // connect to the mongodb database
    let connected_ok: boolean = false;
    try {
      await mongodb_ref.MongoClient.connect();
      connected_ok = true;
    } catch (err) {
      if (err) {
        debugger;
        connected_ok = false;
        mongodb_ref.MongoClient = null;
      }
    }

    // ensure we have a client handle (no-error)
    if (!mongodb_ref.MongoClient) return false;

    // setup error handler
    mongodb_ref.MongoClient.on('error', async function (err) {
      console.log({ MongoDBError: err });
    });

    // return the connection status (true/false)
    return connected_ok;
  }

  // disconnect from the mongodb server
  async disconnect() {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return false;

    // attempt to close connection
    await mongodb_ref.MongoClient.close();
    mongodb_ref.MongoClient = null;

    // return indicating closure
    return true;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% List Databases %%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Will attempt to gather databases and collections by name and return them in a simple string
  // based record.
  async gatherDatabasesAndCollections(): Promise<mongodb_databases_t | null> {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return null;

    const admin_db = mongodb_ref.MongoClient.db('admin').admin();
    const db_info = await admin_db.listDatabases();

    const databases: mongodb_databases_t = {};
    for (const db_entry of db_info.databases) {
      const db_name = db_entry.name;

      databases[db_name] = {};

      const db_handle = mongodb_ref.MongoClient.db(db_name);

      const collections = await db_handle
        .listCollections({}, { nameOnly: true })
        .toArray();

      if (collections.length !== 0) {
        for (const coll of collections) {
          databases[db_name][coll.name] = true;
        }
      }
    }

    // return the databases
    return databases;
  }

  // check if a database exists
  async databaseExists(db_name: string) {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return null;

    const dbs_and_collections =
      await mongodb_ref.gatherDatabasesAndCollections();
    if (!dbs_and_collections) return false;
    if (dbs_and_collections[db_name]) return true;
    return false;
  }

  // check if a collection exists within a database
  async collectionExists(db_name: string, collection_name: string) {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return null;

    const dbs_and_collections =
      await mongodb_ref.gatherDatabasesAndCollections();
    if (!dbs_and_collections) return false;
    if (!dbs_and_collections[db_name]) return false;
    if (!dbs_and_collections[db_name][collection_name]) return false;
    return true;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Collection Index(s) %%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Important: Creating indexes are idempotent.  You cannot create duplicate
  // indexes, so setting them over and over won't result in actually removing and
  // reindexing anything.

  // Create an index on a collection
  async createIndexOnCollection(params: {
    db: string;
    collection: string | undefined;
    unique: boolean | undefined;
    spec: IndexSpecification;
    skip_local_cache_lookup?: boolean;
  }) {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return false;
    if (!params.collection) return false;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return false;

    // Set the collection.  If this is a filestore collection, append '.files' as this is where we'd like to be storing
    // indexes, not on any data sets.
    let collection: Collection | null = null;
    collection = db.collection(params.collection);

    // just set default value for the sake of the index name generator
    if (params.unique !== true) params.unique = false;

    // set index name
    const index_name = sha1(
      params.db +
        '__' +
        params.collection +
        '__' +
        JSON.stringify(params.spec) +
        '__' +
        params.unique
    );

    // check if the index already exists
    if (mongodb_ref.known_indexes[index_name]) {
      return true;
    }

    // set index flag
    mongodb_ref.known_indexes[index_name] = true;

    // attempt to create the index
    if (params.unique === true) {
      await collection.createIndex(params.spec, { unique: true });
    } else {
      await collection.createIndex(params.spec);
    }

    // return indicating success
    return true;
  }

  // Delete index from a collection.
  async deleteIndexFromCollection(params: {
    db: string;
    collection: string | undefined;
    spec: IndexSpecification;
  }) {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return false;
    if (!params.collection) return false;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return false;

    // Set the collection.  If this is a filestore collection, append '.files' as this is where we'd like to be storing
    // indexes, not on any data sets.
    const collection: Collection | null = db.collection(params.collection);

    // NOTE: This casting params.spec to string is a hack.  The types for dropIndex don't list index spec
    // as a valid option, but the method itself does in fact take index specs as input.  We are forced
    // into this cast to prevent having to use index names, which if we did use, would lead to code looking
    // wonky with a mix of index specs and index names.
    const drop_result = await collection.dropIndex(params.spec as string);
    if (drop_result) if (drop_result.ok) return true;

    return false;
  }

  // check if index already exists
  async indexAlreadyExists(params: {
    db: string;
    collection: string;
    spec: IndexSpecification;
  }): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return false;
    if (!params.collection) return false;

    // select the DB
    let db: Db | null = null;
    try {
      db = mongodb_ref.MongoClient.db(params.db);
    } catch (err) {
      if (err) db = null;
    }

    // exit if we can't gather database handle
    if (db === null) return false;

    // Set the collection.  If this is a filestore collection, append '.files' as this is where we'd like to be storing
    // indexes, not on any data sets.
    const collection: Collection | null = db.collection(params.collection);

    // gather indexes
    const indexes = await collection.indexes();

    // normalize spec to consistent key ordering
    const wanted_key = JSON.stringify(params.spec);

    for (const idx of indexes) {
      const existing_key = JSON.stringify(idx.key);
      if (existing_key === wanted_key) {
        return true;
      }
    }

    return false;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Create/Delete Database %%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // create a database
  async createDatabase(params: {
    name: string;
    info: {
      description: string;
      extra?: Record<string, string | number | boolean> | undefined;
    };
  }): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return false;

    // ensure the database doesn't already exist
    if ((await mongodb_ref.databaseExists(params.name)) === true) return false;

    // create database handle
    const db_handle = mongodb_ref.MongoClient.db(params.name);

    // create a collection in the database
    if (!(await db_handle.createCollection('db_info'))) return false;
    return true;
  }

  // This will delete a database (all data, collections, indexes, etc.)
  async deleteDatabase(db_name: string): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;

    // ensure we have a client
    if (!mongodb_ref.MongoClient) return false;

    // gather handle
    const db_handle = mongodb_ref.MongoClient.db(db_name);

    // drop the database
    return await db_handle.dropDatabase();
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Create/Delete Collections %%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // create a collection within a database
  async createCollection(params: {
    db: string;
    collection: string;
  }): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;

    if (!mongodb_ref.MongoClient) return false;

    // select the DB
    const db: Db = mongodb_ref.MongoClient.db(params.db);

    // create the collection
    let created_ok: boolean = false;
    try {
      await db.createCollection(params.collection);
      created_ok = true;
    } catch (err) {
      if (err) created_ok = false;
    }
    return created_ok;
  }

  // deletes a collection within a database
  async deleteCollection(params: {
    db: string;
    collection: string;
  }): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;

    if (!mongodb_ref.MongoClient) return false;

    // select the DB
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    return await db.dropCollection(params.collection);
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Document Counts %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // count documents in a collection
  async countDocuments(params: {
    db: string;
    collection: string;
    filter: Filter<Document>;
    options?: CountDocumentsOptions;
  }): Promise<number> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return -1;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return -1;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return -1;

    // count documents
    return await collection.countDocuments(params.filter, params.options);
  }

  // estimate count
  async estimatedDocumentCount(params: {
    db: string;
    collection: string;
    options: EstimatedDocumentCountOptions;
  }): Promise<number> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return -1;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return -1;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return -1;

    // return the estimated document count
    return await collection.estimatedDocumentCount(params.options);
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Aggregations %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Aggregations are a powerful feature of mongodb which allows
  // the ability to utilize pipelines to gather and even transform
  // data.
  //
  // https://www.mongodb.com/docs/drivers/node/current/aggregation/
  // https://www.mongodb.com/docs/manual/reference/mql/aggregation-stages/#std-label-aggregation-pipeline-operator-reference
  //
  async aggregateCollection(params: {
    db: string;
    collection: string;
    pipeline: Document[];
    options?: AggregateOptions;
    cb?: (
      params: {
        document: Document | null;
        extra: {
          idx: number;
          mongodb_ref: MongoDB;
          cursor: AggregationCursor<Document>;
        };
      } | null
    ) => Promise<void | 'breakloop'>;
  }): Promise<Document[] | boolean> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return false;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return false;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return false;

    // create aggregation cursor
    const aggregation_cursor = collection.aggregate(
      params.pipeline,
      params.options
    );

    // if no cb is provided, return results as an array
    if (!params.cb) return await aggregation_cursor.toArray();

    // process via callbacks
    let doc_idx = 0;
    for await (const doc of aggregation_cursor) {
      const cb_indicator = await params.cb({
        document: doc,
        extra: {
          cursor: aggregation_cursor,
          mongodb_ref: mongodb_ref,
          idx: doc_idx
        }
      });
      if (cb_indicator === 'breakloop') return true;
      doc_idx++;
    }

    // run final callback indicating we're done
    await params.cb(null);
    return true;
  }

  // Runs an aggregate query against a database (not a collection)
  // https://www.mongodb.com/docs/manual/reference/mql/aggregation-stages/#std-label-aggregation-pipeline-operator-reference
  async aggregateDB(params: {
    db: string;
    pipeline: Document[];
    options?: AggregateOptions;
    cb?: (
      params: {
        document: Document | null;
        extra: {
          idx: number;
          mongodb_ref: MongoDB;
          cursor: AggregationCursor<Document>;
        };
      } | null
    ) => Promise<void | 'breakloop'>;
  }): Promise<boolean | Document[]> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return false;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return false;

    // create aggregation cursor
    const aggregation_cursor = db.aggregate(params.pipeline, params.options);

    // return documents as an array if no cb is provided
    if (!params.cb) return await aggregation_cursor.toArray();

    // iterate results and run callback
    let doc_idx = 0;
    for await (const doc of aggregation_cursor) {
      const cb_indicator = await params.cb({
        document: doc,
        extra: {
          cursor: aggregation_cursor,
          idx: doc_idx,
          mongodb_ref: mongodb_ref
        }
      });
      if (cb_indicator === 'breakloop') return true;
      doc_idx++;
    }

    // run final callback indicating we're done
    await params.cb(null);
    return true;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Random Samplings %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // Gather a random sample of documents from a collection.  Uses the $sample
  // pipeline on an aggregate query to quickly sample documents.  This utility
  // is here to demonstrate how to do this correctly.  When randomly sampling
  // it is unwise to use $match for finding, as it can result in a full (slow)
  // collection scan.
  async randomSampleFromCollection(params: {
    db: string;
    collection: string;
    sample_size_n: number;
    cb?: (
      params: {
        document: Document | null;
        extra?: {
          idx: number;
          mongodb_ref: MongoDB;
          cursor: AggregationCursor<Document>;
        };
      } | null
    ) => Promise<void | 'breakloop'>;
  }): Promise<Document[] | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // create aggregation cursor
    const cursor = collection.aggregate([
      { $sample: { size: params.sample_size_n } }
    ]);

    // return as array if we don't have a callback
    if (!params.cb) return cursor.toArray();

    // iterate through documents and execute callback
    let idx = 0;
    for await (const doc of cursor) {
      const cb_result = await params.cb({
        document: doc,
        extra: {
          idx: idx,
          mongodb_ref: mongodb_ref,
          cursor: cursor
        }
      });
      if (cb_result) {
        if (cb_result === 'breakloop') break;
      }
      idx++;
    }
    await params.cb(null);

    // return an empty set if the collection has already been handled
    return [];
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Standard Records %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // insert records into a database collection.
  async insertSingleRecord(params: {
    db: string;
    collection: string;
    record: OptionalId<Document>;
    write_options?: BulkWriteOptions;
  }): Promise<InsertOneResult<Document> | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // insert records
    return await collection.insertOne(params.record, params.write_options);
  }

  // insert records into a database collection.
  async insertRecords(params: {
    db: string;
    collection: string;
    records: readonly OptionalId<Document>[];
    write_options?: BulkWriteOptions;
  }): Promise<InsertManyResult<Document> | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // gather db
    const db: Db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // insert records
    return await collection.insertMany(params.records, params.write_options);
  }

  // update a single record at max
  async updateSingleRecord(params: {
    db: string;
    collection: string;
    find: Filter<Document>;
    update: Document[] | UpdateFilter<Document>;
    update_options?: UpdateOptions;
  }): Promise<UpdateResult | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // run update
    return await collection.updateOne(
      params.find,
      params.update,
      params.update_options
    );
  }

  // update multiple records
  async updateRecords(params: {
    db: string;
    collection: string;
    find: Filter<Document>;
    update: Document[] | UpdateFilter<Document>;
    update_options?: UpdateOptions;
  }): Promise<UpdateResult | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // run update
    return await collection.updateMany(
      params.find,
      params.update,
      params.update_options
    );
  }

  // find a single record
  async findSingleRecord(params: {
    db: string;
    collection: string;
    find: Filter<Document>;
  }): Promise<WithId<Document> | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // return the find result directly
    return await collection.findOne(params.find);
  }

  // Execute a find query and run a callback on each found record.  If you want to terminate
  // the cursor loop in callback, just return 'breakloop' from the callback.
  async findRecords(params: {
    db: string;
    collection: string;
    find: Filter<Document>;
    options?: FindOptions;
    cb?: (
      params: {
        document: WithId<Document> | null;
        extra?: {
          idx: number;
          mongodb_ref: MongoDB;
          cursor: FindCursor<WithId<Document>>;
        };
      } | null
    ) => Promise<void | 'breakloop'>;
  }): Promise<WithId<Document>[] | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // return the find result directly
    const cursor = collection.find(params.find, params.options);

    // return as array if we don't have a callback
    if (!params.cb) return cursor.toArray();

    // iterate through documents and execute callback
    let idx = 0;
    for await (const doc of cursor) {
      const cb_result = await params.cb({
        document: doc,
        extra: {
          idx: idx,
          mongodb_ref: mongodb_ref,
          cursor: cursor
        }
      });
      if (cb_result) {
        if (cb_result === 'breakloop') break;
      }
      idx++;
    }
    await params.cb(null);

    // return an empty set if the collection has already been handled
    return [];
  }

  // find distinct values within a collection
  async distinctValues(params: {
    db: string;
    collection: string;
    key: string;
    find: Filter<Document>;
    options: DistinctOptions;
  }) {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // return the find result directly
    return await collection.distinct(params.key, params.find, params.options);
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Delete Records %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // delete a single record
  async deleteSingleRecord(params: {
    db: string;
    collection: string;
    find: Filter<Document>;
  }): Promise<DeleteResult | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);
    if (!collection) return null;

    // delete record
    return await collection.deleteOne(params.find);
  }

  // delete records
  async deleteRecords(params: {
    db: string;
    collection: string;
    find: Filter<Document>;
  }): Promise<DeleteResult | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);

    // exit if we can't gather database handle
    if (!db) return null;

    // gather collection
    const collection = db.collection(params.collection);

    // ensure we have collection
    if (!collection) return null;

    // delete records
    return await collection.deleteMany(params.find);
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% GridFS Records %%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // MongoDB supports a "filesystem" called GridFS which is incredibly
  // useful for our purposes with regards to storing files.  A GridFS
  // collection is actually two collections, one which stores metadata
  // and one which stores chunks (buckets) of the actual files.  The
  // methods that follow are implemented specifically for working with
  // GridFS.

  // IMPORTANT: GridFS collections are all prefixed with GFS__ for easy identification;
  // our methods below always add this prefix.  The reason is that in the past we didn't
  // do this and it made visually browsing our collections a confusing mess.  You must
  // be aware of this prefixing if you intend to work with the collecions directly using
  // non-gridfs methods, or using the mongo client directly.

  // Similar to createCollection, this creates a gridfs bucket with the correct initial indexes.  MongoDB
  // does not have a createBucket method, or anything similar, so this method attempts to implement it
  // through creating the correct structure of a gridfs bucket (two collections)
  async GFS_createBucket(params: {
    db: string;
    bucket_name: string;
  }): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return false;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return false;

    // gfs buckets are comprised of two collections, a files and chunks collection.
    const files_coll = `${params.bucket_name}.files`;
    const chunks_coll = `${params.bucket_name}.chunks`;

    // Create the collections if they do not exist
    let existing_collections = await db.listCollections().toArray();
    let names = existing_collections.map((c) => c.name);

    // create collections
    if (!names.includes(files_coll)) await db.createCollection(files_coll);
    if (!names.includes(chunks_coll)) await db.createCollection(chunks_coll);

    // ensure the bucket is in place
    existing_collections = await db.listCollections().toArray();
    names = existing_collections.map((c) => c.name);
    if (!names.includes(files_coll) && !names.includes(chunks_coll)) {
      debugger;
      return false;
    }

    // Create required GridFS indexes
    await db
      .collection(files_coll)
      .createIndex({ filename: 1, uploadDate: 1 }, { background: true });
    await db
      .collection(chunks_coll)
      .createIndex({ files_id: 1, n: 1 }, { unique: true, background: true });

    // collections are in place
    return true;
  }

  // delete a GFS bucket (two collections, .files and .chunks)
  async GFS_deleteBucket(params: { db: string; bucket_name: string }) {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return false;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return false;

    // gfs buckets are comprised of two collections, a files and chunks collection.
    const files_coll = `${params.bucket_name}.files`;
    const chunks_coll = `${params.bucket_name}.chunks`;
    const files_deleted_ok = await db.dropCollection(files_coll);
    const chunks_deleted_ok = await db.dropCollection(chunks_coll);

    // ensure collections were dropped successfully
    if (files_deleted_ok && chunks_deleted_ok) return true;

    // return false if things went sour
    return false;
  }

  async GFS_findSingleFileGFS(params: {
    db: string;
    bucket_name: string;
    find: Filter<Document>;
    cb?: (
      params: {
        chunk: Buffer | null;
        extra: {
          file_doc: WithId<Document>;
          idx: number;
          mongodb_ref: MongoDB;
          stream: Readable;
        };
      } | null
    ) => Promise<void | 'breakloop'>;
  }): Promise<file_data_t> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // create prefixed bucketname
    const collection_name = 'GFS__' + params.bucket_name + '.files';
    const bucket_name = 'GFS__' + params.bucket_name;

    // attempt to lookup record from gfs files collection
    const file_doc = await mongodb_ref.findSingleRecord({
      db: params.db,
      collection: collection_name,
      find: params.find
    });
    if (!file_doc) return null;

    // gather bucket and download strem
    const bucket = new GridFSBucket(db, { bucketName: bucket_name });
    const download_stream: Readable = bucket.openDownloadStream(file_doc._id);

    // if there is no callback provided, just download the entire file
    if (!params.cb) {
      let ret_buff = Buffer.alloc(0);
      for await (const chunk of download_stream) {
        ret_buff = Buffer.concat([ret_buff, chunk]);
      }
      return {
        file_doc: file_doc,
        buff: ret_buff
      };
    }

    // Iterate all chunks as they come from the stream
    for await (const chunk of download_stream) {
      if (
        (await params.cb({
          chunk: chunk,
          extra: {
            file_doc: file_doc,
            idx: 0,
            mongodb_ref: mongodb_ref,
            stream: download_stream
          }
        })) === 'breakloop'
      )
        return null;
    }

    // notify the callback that we're done reading
    await params.cb(null);
    return null;
  }

  // Find multiple files, and download them using streaming chunks.
  async GFS_findFiles(params: {
    db: string;
    bucket_name: string;
    find: Filter<Document>;
    cb?: (
      params: {
        chunk: Buffer | null;
        extra: {
          file_doc: WithId<Document>;
          idx: number;
          mongodb_ref: MongoDB;
          stream: Readable;
        };
      } | null
    ) => Promise<void | 'breakloop' | 'nextfile'>;
  }): Promise<file_data_t[] | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // create prefixed bucketname
    const collection_name = 'GFS__' + params.bucket_name + '.files';
    const bucket_name = 'GFS__' + params.bucket_name;
    const bucket = new GridFSBucket(db, { bucketName: bucket_name });

    // gather files in array if we don't have a callback
    if (!params.cb) {
      const file_arr: file_data_t[] = [];
      await mongodb_ref.findRecords({
        db: params.db,
        collection: collection_name,
        find: params.find,
        cb: async function (cb_params) {
          if (!cb_params) return;
          if (!cb_params?.document?._id) return;

          const file_data = await mongodb_ref.GFS_findSingleFileGFS({
            db: params.db,
            bucket_name: params.bucket_name,
            find: { _id: cb_params?.document?._id }
          });

          file_arr.push(file_data);
        }
      });
      return file_arr;
    }

    // If we have a callback, process file as streamed chunks.
    let file_idx = 0;
    await mongodb_ref.findRecords({
      db: params.db,
      collection: collection_name,
      find: params.find,
      cb: async function (cb_params) {
        if (!params.cb) return;
        if (!cb_params) return;
        if (!cb_params?.document?._id) return;

        const download_stream: Readable = bucket.openDownloadStream(
          cb_params?.document?._id
        );

        // Iterate all chunks as they come from the stream
        for await (const chunk of download_stream) {
          const cb_result = await params.cb({
            chunk: chunk,
            extra: {
              file_doc: cb_params?.document,
              idx: file_idx,
              mongodb_ref: mongodb_ref,
              stream: download_stream
            }
          });

          if (cb_result === 'breakloop') return 'breakloop';
          if (cb_result === 'nextfile') {
            file_idx++;
            return;
          }
        }

        // notify the callback that we're done reading
        await params.cb(null);
        file_idx++;
      }
    });

    return null;
  }

  async GFS_deleteSingleFile(params: {
    db: string;
    bucket_name: string;
    find: Filter<Document>;
  }): Promise<boolean> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return false;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);

    // exit if we can't gather database handle
    if (!db) return false;

    // create prefixed bucketname
    const bucket_name = 'GFS__' + params.bucket_name;

    // find the file document in "<bucket_name>.files"
    const files_coll = db.collection(`${bucket_name}.files`);
    const file_doc = await files_coll.findOne(params.find);

    if (!file_doc) {
      return false;
    }

    const bucket = new GridFSBucket(db, { bucketName: bucket_name });

    const file_id: ObjectId = file_doc._id;
    await bucket.delete(file_id);

    return true;
  }

  // delete files
  async GFS_deleteFiles(params: {
    db: string;
    bucket_name: string;
    find: Filter<Document>;
  }): Promise<number> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return -1;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);

    // exit if we can't gather database handle
    if (!db) return -1;

    // create prefixed bucketname
    const bucket_name = 'GFS__' + params.bucket_name;

    // find all matching file documents in "<bucket_name>.files"
    const files_coll = db.collection(`${bucket_name}.files`);
    const cursor = files_coll.find(params.find);
    const bucket = new GridFSBucket(db, { bucketName: bucket_name });

    let deleted_count = 0;
    for await (const file_doc of cursor) {
      const file_id: ObjectId = file_doc._id;
      await bucket.delete(file_id);
      deleted_count += 1;
    }

    return deleted_count;
  }

  // store a file using a buffer as input
  async GFS_storeFileFromBuffer(params: {
    db: string;
    bucket_name: string;
    filename: string;
    file_metadata: Document;
    file_content_buffer: Buffer;
  }): Promise<ObjectId | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // create prefixed bucketname
    const bucket_name = 'GFS__' + params.bucket_name;

    const bucket = new GridFSBucket(db, {
      bucketName: bucket_name
    });

    const upload_stream: GridFSBucketWriteStream = bucket.openUploadStream(
      params.filename,
      {
        metadata: params.file_metadata
      }
    );

    // Write the buffer and then end the stream
    upload_stream.end(params.file_content_buffer);

    // Wait until finish event
    const file_id = await new Promise<ObjectId>((resolve, reject) => {
      upload_stream.on('finish', () => {
        const file_id: ObjectId = upload_stream.id as ObjectId;
        resolve(file_id);
      });
      upload_stream.on('error', (err) => {
        reject(err);
      });
    });

    // update a single record at max
    await mongodb_ref.updateSingleRecord({
      db: params.db,
      collection: 'GFS__' + params.bucket_name + '.files',
      find: {
        _id: file_id
      },
      update: {
        $set: {
          'metadata.file_sha1': sha1(params.file_content_buffer)
        }
      }
    });

    // return the file id
    return file_id;
  }

  async GFS_storeFileFromStream(params: {
    db: string;
    bucket_name: string;
    filename: string;
    file_metadata: Document;
    file_content_stream: Readable;
  }): Promise<ObjectId | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // create prefixed bucketname
    const bucket_name = 'GFS__' + params.bucket_name;

    const bucket = new GridFSBucket(db, { bucketName: bucket_name });

    const upload_stream: GridFSBucketWriteStream = bucket.openUploadStream(
      params.filename,
      {
        metadata: params.file_metadata
      }
    );

    // we use the stream hashing utility in order to guarantee that the hash of
    // content going into the db is the same as the file.
    const hash_transformer = new MongoDBStreamHash();
    params.file_content_stream.pipe(hash_transformer).pipe(upload_stream);

    const file_id = await new Promise<ObjectId>((resolve, reject) => {
      upload_stream.on('finish', () => {
        const file_id: ObjectId = upload_stream.id as ObjectId;
        resolve(file_id);
      });
      upload_stream.on('error', (err) => {
        reject(err);
      });
    });

    // update a single record at max
    await mongodb_ref.updateSingleRecord({
      db: params.db,
      collection: 'GFS__' + params.bucket_name + '.files',
      find: {
        _id: file_id
      },
      update: {
        $set: {
          'metadata.file_sha1': hash_transformer.digest_hex
        }
      }
    });

    // return the file id
    return file_id;
  }

  // update a single files metadata
  async GFS_updateSingleFileMetadata(params: {
    db: string;
    bucket_name: string;
    find: Filter<Document>;
    update: Document[] | UpdateFilter<Document>;
  }): Promise<UpdateResult<Document> | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);
    if (!db) return null;

    // create prefixed bucketname
    const bucket_name = 'GFS__' + params.bucket_name;

    // gather collection
    const collection = db.collection(bucket_name + '.files');

    // update single metadata
    return await collection.updateOne(params.find, params.update);
  }

  async GFS_updateFilesMetadata(params: {
    db: string;
    bucket_name: string;
    find: Filter<Document>;
    update: Document[] | UpdateFilter<Document>;
  }): Promise<UpdateResult<Document> | null> {
    // set self reference
    const mongodb_ref = this;
    if (!mongodb_ref.MongoClient) return null;

    // select the DB
    const db = mongodb_ref.MongoClient.db(params.db);

    // exit if we can't gather database handle
    if (!db) return null;

    // create prefixed bucketname
    const bucket_name = 'GFS__' + params.bucket_name;

    // gather collection
    const collection = db.collection(bucket_name + '.files');

    // update multiple metadata
    return await collection.updateMany(params.find, params.update, {
      upsert: true
    });
  }
}
