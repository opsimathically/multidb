import { Transform, TransformCallback } from 'stream';
import { createHash, Hash } from 'crypto';

/**
 * Transform stream that passes data through unchanged
 * while computing a SHA1 digest.  This is used as a pipeline
 * for computing hashes for gridfs as they pass through into the DB.
 */
export class MongoDBStreamHash extends Transform {
  private sha1_hash: Hash;
  public digest_hex: string | null;

  constructor() {
    super();
    this.sha1_hash = createHash('sha1');
    this.digest_hex = null;
  }

  _transform(
    chunk: Buffer | string,
    _encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.sha1_hash.update(chunk);
    this.push(chunk);
    callback();
  }

  _flush(callback: TransformCallback): void {
    this.digest_hex = this.sha1_hash.digest('hex');
    callback();
  }
}
