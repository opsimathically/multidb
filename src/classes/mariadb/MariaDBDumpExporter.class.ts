import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface mariadb_dump_exporter_config_i {
  host: string;
  user: string;
  database: string;

  password?: string;
  port?: number;

  // Where to write the dump file.
  output_file_path: string;

  // Optional explicit path to mysqldump / mariadb-dump binary.
  mysqldump_path?: string;

  // Any extra arguments to append to the mysqldump invocation.
  extra_args?: string[];

  // Optional environment overrides.
  env?: NodeJS.ProcessEnv;
}

export type mariadb_dump_export_result_t = {
  exit_code: number;
  signal: NodeJS.Signals | null;
  dumped_bytes: number;
  duration_ms: number;
  stderr: string;
};

export class MariaDBDumpExporter {
  private readonly dump_config: mariadb_dump_exporter_config_i;

  constructor(dump_config: mariadb_dump_exporter_config_i) {
    this.dump_config = dump_config;
  }

  public async exportDatabase(): Promise<mariadb_dump_export_result_t> {
    this.ensureOutputDirectory();

    const start_time = Date.now();
    const output_stream = fs.createWriteStream(
      this.dump_config.output_file_path
    );

    const mysqldump_path = this.dump_config.mysqldump_path ?? 'mysqldump';
    const args = this.buildCommandArgs();

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      ...(this.dump_config.env ?? {})
    };

    let dumped_bytes = 0;
    let stderr_buffer = '';

    return await new Promise<mariadb_dump_export_result_t>(
      (resolve, reject) => {
        const child = spawn(mysqldump_path, args, { env });

        child.stdout.on('data', (chunk: Buffer) => {
          dumped_bytes += chunk.length;
          output_stream.write(chunk);
        });

        child.stderr.on('data', (chunk: Buffer) => {
          stderr_buffer += chunk.toString('utf8');
        });

        child.on('error', (err) => {
          output_stream.end();
          reject(err);
        });

        child.on('close', (exit_code, signal) => {
          output_stream.end();

          const duration_ms = Date.now() - start_time;

          if (exit_code !== 0) {
            const error = new Error(
              `mysqldump exited with code ${exit_code}, signal=${signal}, stderr=${stderr_buffer}`
            );
            // Attach some extra metadata in case caller wants it.
            (error as any).exit_code = exit_code;
            (error as any).signal = signal;
            (error as any).stderr = stderr_buffer;
            return reject(error);
          }

          resolve({
            exit_code: exit_code ?? 0,
            signal,
            dumped_bytes,
            duration_ms,
            stderr: stderr_buffer
          });
        });
      }
    );
  }

  private buildCommandArgs(): string[] {
    const args: string[] = [];

    const host = this.dump_config.host;
    const user = this.dump_config.user;
    const database = this.dump_config.database;
    const port = this.dump_config.port;
    const password = this.dump_config.password;
    const extra_args = this.dump_config.extra_args ?? [];

    // Basic connection params
    if (host) {
      args.push('-h', host);
    }

    if (typeof port === 'number') {
      args.push('-P', String(port));
    }

    if (user) {
      args.push('-u', user);
    }

    // Note: this will expose password in process list on some systems.
    // If you prefer not to do that, you can rely on option files or MYSQL_PWD.
    if (password) {
      args.push(`--password=${password}`);
    }

    // Commonly useful flags; up to you if you want these by default.
    // You can also push them from extra_args instead.
    // args.push("--single-transaction");
    // args.push("--quick");

    // Append any user-specified additional args
    args.push(...extra_args);

    // Database name must be last positional argument
    args.push(database);

    return args;
  }

  private ensureOutputDirectory(): void {
    const dir_name = path.dirname(this.dump_config.output_file_path);
    if (!fs.existsSync(dir_name)) {
      fs.mkdirSync(dir_name, { recursive: true });
    }
  }
}
