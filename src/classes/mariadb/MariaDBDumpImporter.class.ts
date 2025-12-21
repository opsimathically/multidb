import { spawn } from 'child_process';
import { createReadStream, statSync, ReadStream } from 'fs';

/*
This class is a shell wrapper that feeds a file into the mysql binary.  This is a very
dangerous class, and care should be taken when using it.  I am aware of packages such as
mysql-importer, but they are not guaranteed to perfectly parse things such as stored procedures,
or more esoteric functionality that could be found in a dump file.  For this reason, I have selected
to simply wrap the mysql binary and feed mysqldumps into the mysql binary directly.  This means there
is a possibility of pollutions, injections, etc.  Be very careful.  Define things statically, do 
not allow user input into any parameters.  Use at your own risk.
*/

type blah_t = {
  hello: string;
};

export { blah_t };

/*
Usage example:

  const importer = new MariaDBDumpImporter({
    mysql_bin_path: "mysql",
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "my_password",
    database: "my_database",
    default_character_set: "utf8mb4",
    use_mysql_pwd_env: true,
    connect_timeout_seconds: 10
  });

  const result = await importer.importFile("/path/to/dump.sql")
*/

export type mysql_importer_options_t = {
  mysql_bin_path?: string; // default: "mysql"
  host?: string;
  port?: number;
  socket_path?: string; // e.g. /var/run/mysqld/mysqld.sock
  user: string;
  password?: string;
  database?: string; // optional; omit if dump contains CREATE DATABASE/USE
  default_character_set?: string; // e.g. "utf8mb4"
  ssl_ca_path?: string;
  ssl_cert_path?: string;
  ssl_key_path?: string;
  extra_args?: string[]; // raw args passed to mysql
  use_mysql_pwd_env?: boolean; // put password in MYSQL_PWD instead of -p
  connect_timeout_seconds?: number; // maps to --connect-timeout
};

export type mysql_import_result_t = {
  exit_code: number;
  stdout: string;
  stderr: string;
};

export class MariaDBDumpImporter {
  private options: mysql_importer_options_t;

  constructor(options: mysql_importer_options_t) {
    if (!options.user) {
      throw new Error('mysql_importer_options_t.user is required');
    }
    this.options = {
      mysql_bin_path: 'mysql',
      ...options
    };
  }

  public async importFromStream(
    sql_stream: ReadStream
  ): Promise<mysql_import_result_t> {
    const args = this.buildArgs();

    const env = { ...process.env };

    if (this.options.password && this.options.use_mysql_pwd_env) {
      env.MYSQL_PWD = this.options.password;
    }

    const mysql_bin = this.options.mysql_bin_path ?? 'mysql';

    return new Promise<mysql_import_result_t>((resolve, reject) => {
      const child = spawn(mysql_bin, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env
      });

      let stdout_buf = '';
      let stderr_buf = '';
      let timeout_handle: NodeJS.Timeout | null = null;
      let finished = false;

      const fail = (err: Error) => {
        if (finished) return;
        finished = true;
        if (timeout_handle) clearTimeout(timeout_handle);
        try {
          child.kill('SIGKILL');
        } catch {}
        reject(err);
      };

      if (
        this.options.connect_timeout_seconds &&
        this.options.connect_timeout_seconds > 0
      ) {
        timeout_handle = setTimeout(() => {
          fail(
            new Error(
              `mysql dump import timed out after ${this.options.connect_timeout_seconds} seconds`
            )
          );
        }, this.options.connect_timeout_seconds * 1000);
      }

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');

      child.stdout.on('data', (chunk: string) => {
        stdout_buf += chunk;
      });

      child.stderr.on('data', (chunk: string) => {
        stderr_buf += chunk;
      });

      child.on('error', (err) => fail(err));

      child.on('close', (code) => {
        if (finished) return;
        finished = true;
        if (timeout_handle) clearTimeout(timeout_handle);

        const exit_code = code ?? -1;

        if (exit_code !== 0) {
          reject(
            new Error(
              `mysql exited with code ${exit_code}\n` +
                (stderr_buf ? `stderr:\n${stderr_buf}` : '')
            )
          );
        } else {
          resolve({
            exit_code,
            stdout: stdout_buf,
            stderr: stderr_buf
          });
        }
      });

      sql_stream.on('error', (err) => fail(err));

      sql_stream.pipe(child.stdin!);
    });
  }

  public async importFile(dump_path: string): Promise<mysql_import_result_t> {
    try {
      const st = statSync(dump_path);
      if (!st.isFile()) {
        throw new Error(`SQL dump path is not a file: ${dump_path}`);
      }
    } catch (e) {
      throw new Error(
        `Cannot stat SQL dump file: ${dump_path}: ${(e as Error).message}`
      );
    }

    const stream = createReadStream(dump_path);
    return this.importFromStream(stream);
  }

  private buildArgs(): string[] {
    const args: string[] = [];

    if (this.options.host) args.push('-h', this.options.host);
    if (this.options.port) args.push('-P', String(this.options.port));
    if (this.options.socket_path)
      args.push('--socket', this.options.socket_path);

    if (this.options.user) args.push('-u', this.options.user);

    if (this.options.password && !this.options.use_mysql_pwd_env) {
      args.push(`-p${this.options.password}`);
    }

    if (this.options.default_character_set) {
      args.push('--default-character-set', this.options.default_character_set);
    }

    if (
      this.options.connect_timeout_seconds &&
      this.options.connect_timeout_seconds > 0
    ) {
      args.push(
        '--connect-timeout',
        String(this.options.connect_timeout_seconds)
      );
    }

    if (this.options.ssl_ca_path) {
      args.push('--ssl-ca', this.options.ssl_ca_path);
    }
    if (this.options.ssl_cert_path) {
      args.push('--ssl-cert', this.options.ssl_cert_path);
    }
    if (this.options.ssl_key_path) {
      args.push('--ssl-key', this.options.ssl_key_path);
    }

    if (this.options.extra_args && this.options.extra_args.length > 0) {
      args.push(...this.options.extra_args);
    }

    if (this.options.database) {
      args.push(this.options.database);
    }

    return args;
  }
}
