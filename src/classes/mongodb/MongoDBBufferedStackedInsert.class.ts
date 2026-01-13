import type { MongoDB } from './MongoDB.class';
import type {
  BulkWriteOptions,
  OptionalId,
  Document,
  WriteError
} from 'mongodb';
import { BufferedArray } from '../buffered_array/BufferedArray.class';

export class MongoDBBufferedStackedInsert<insert_args_g> {
  private mongodb_client: MongoDB;
  buffered_array: BufferedArray<
    insert_args_g,
    MongoDBBufferedStackedInsert<insert_args_g>
  >;
  private db: string;
  private collection: string;
  private write_options: BulkWriteOptions | undefined;
  private onError: (err: WriteError) => Promise<void>;
  constructor(params: {
    db: string;
    collection: string;
    write_options?: BulkWriteOptions;
    mongodb_client: MongoDB;
    interval_ms: number;
    max_length: number;
    onError: (err: WriteError) => Promise<void>;
  }) {
    const self_ref = this;
    this.db = params.db;
    this.collection = params.collection;
    this.write_options = params.write_options;
    this.mongodb_client = params.mongodb_client;
    this.onError = params.onError;
    this.buffered_array = new BufferedArray<
      insert_args_g,
      MongoDBBufferedStackedInsert<insert_args_g>
    >({
      config: {
        interval_ms: params.interval_ms,
        max_length: params.max_length
      },
      extra: self_ref,
      flush_callback: async (params) => {
        try {
          await params.extra.mongodb_client.insertRecords({
            db: params.extra.db,
            collection: params.extra.collection,
            write_options: params.extra.write_options,
            records: params.items as OptionalId<Document>[]
          });
        } catch (err) {
          if (self_ref.onError) self_ref.onError(err as WriteError);
        }
        // console.log({ flushed: params.items.length });
      }
    });
  }

  // add records to insert
  public async bufferedInsert(params: {
    records: insert_args_g[];
  }): Promise<null> {
    const buffered_stacked_insert = this;
    if (!params.records) return null;
    await buffered_stacked_insert.buffered_array?.addMany(params.records);
    return null;
  }

  // flush any records that haven't already been inserted
  public async flush() {
    const buffered_stacked_insert = this;
    if (!buffered_stacked_insert.buffered_array.getSize()) return true;
    await buffered_stacked_insert.buffered_array.flushNow();
    return true;
  }
}
