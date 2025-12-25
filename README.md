# Multidb Library

This is not intended for use by every person, in every case. It is designed for me, in my use cases. If you have similar use cases, it could be useful to you, but I'd prefer you use your own code for your own cases. I do things that could be seen as strange, embedding data in places, collections or otherwise, that only makes sense for tools that I've personally developed. If you use this code you may find things in places you don't expect or need.

The intent of this code is to take code that I use for database purposes, within my own tool libraries and standardize them into a single library which can be imported and easily used for the development and integration of new tools or packages I'm developing.

## MariaDB

The design philosophy of these classes is to provide a middle layer which is not an ORM, but is also not completely just perfectly raw SQL. The goal is to provide a typed interface where queries can be defined, arguments can be typed, and results can be similarly typed. Schemeas are parsed via an introspector, queries are compared against that parsed schema, and out of date/wrong queries can be detected at application runtime. For me personally, on my projects, one of the key issues I have with RDBMS is that I constantly want to prototype new database designs but the queries often fall out of syntax with the running schema. With these classes I can preload the queries and compare them against the current schema before any of the loaded queries ever run, thus preventing likely problems. This is not a perfect solution, and I in no way claim it is, but with SQL and it's stringyness, perfect solutions are a bit computationally impractical. Our schema introspector is designed to work with SELECT, INSERT, UPDATE, and DELETE queries. It does not attempt to do any work with stored procedures or anything similar.

Most methods require strings for pool name and database name, this is a bit inefficient, but adds clarity of functionality when I'm reading years old code. A lot of my code reflects the anxiety of managing a large personal code base, this is an affectation of that anxiety. If you don't want to see the database name/pool name over and over, you can just create a wrapper to supply them automatically.

**_IMPORTANT_**: each of the query template creators in the MariaDB class has an option to skip the query validator. If your queries are weird, and you know what you're doing, you can disable the validator. This can be necessary for things like renaming results (eg SELECT something as something_else), etc.

We provide each validated query a class instance with an execute method, which can run either in a streamed row by row callback to alleviate potential memory consumption issues, or without a callback to retrieve all rows at once.

### Query Template Types

Our MariaDB client provides a simple way to template different query types.

- Query: standard query that takes standard execute parameters.
- Stacked Insert Query: query which takes a stack of multiple sets of arguments.
- Buffered Stacked Insert Query: stacked query which will stack query arguments until a limit size before flushing/executing the query.

### MariaDB Usage Examples

```typescript
import {
  MongoDB,
  MariaDBDumpImporter,
  MariaDB,
  MariaDBDatabaseSchemaIntrospector,
  MariaDBSQLQueryValidator
} from '@opsimathically/multidb';

// Example: Using an Admin Pool to Create/Drop a database.

// standard pool configuration
const mariadb_pool_config = {
  connectionLimit: 500,
  waitForConnections: true,
  queueLimit: 65535,
  host: '127.0.0.1',
  user: 'your_mariadb_user',
  password: 'your_mariadb_password!',
  debug: false,
  insecureAuth: true
};

// admin pool configuration
const mariadb_adminpool_config = {
  connectionLimit: 500,
  waitForConnections: true,
  queueLimit: 65535,
  host: '127.0.0.1',
  user: 'your_mariadb_user',
  password: 'your_mariadb_password!',
  debug: false,
  insecureAuth: true
};

// entry point
(async () => {
  // create new client handle
  const mariadb_client = new MariaDB();

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Admin Pools %%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // add an admin pool (this will be used for things like create/drop database)
  await mariadb_client.addAdminPool({
    name: 'db1_adminpool1',
    pool_options: mariadb_adminpool_config
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

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Standard Pools %%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // add a pool
  await mariadb_client.addPool({
    name: 'db1_pool1',
    db: 'unit_test_db_1000',
    pool_options: mariadb_pool_config
  });

  type example_insert_t = [string, string];

  // add a query
  const insert_query = await mariadb_client.addQuery<
    example_insert_t,
    ResultSetHeader
  >({
    pool: 'db1_pool1',
    db: 'unit_test_db_1000',
    name: 'testInsertQuery',
    query: `
        INSERT INTO unit_test_db_1000.new_table
        (
          column_1,
          column_2
        )
        VALUES
        (
          ?,
          ?
        )`
  });

  // insert some data a single record at a time
  await insert_query.execute({
    args: ['something1', 'something2']
  });
  await insert_query.execute({
    args: ['something3', 'something4']
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

  assert(buffered_stacked_insert, 'Failed to create buffered stacked insert.');

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

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Select Queries %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  type select_row_example_t = {
    id: number;
    column_1: string;
    column_2: string;
  };

  const select_query_example = await mariadb_client.addQuery<
    null,
    select_row_example_t
  >({
    pool: 'db1_pool1',
    db: 'unit_test_db_1000',
    name: 'selectRecords',
    query: `SELECT * FROM unit_test_db_1000.new_table;`
  });

  // Iterate rows via callback.  This uses streams via the callback API in the underlying
  // mysql library.  This is preferred for larger selects where you have to iterate over a
  // large number of rows.  Rows are fetched one at a time, WITHOUT using a cursor, so memory
  // exhaustion is less of a risk.
  await select_query_example.execute({
    args: null,
    cb: async function (params) {
      //
      // params.row will be of type select_row_example_t
      //
      // you can stop reading results at any time by returning
      // the string breakloop.
      // eg:
      // return 'breakloop';
    }
  });

  // you can also just fetch all rows at once.  In this case
  // it'll be an array of select_row_example_t.
  const selected_rows = await select_query_example.execute();

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%% Shutdown %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // this will close all connections in all pools
  const shutdown_ok = await mariadb_client.shutdown({
    admin_pools: true,
    standard_pools: true
  });
})();
```

## MariaDBDumpImporter

This is a frontend for working with the mysql/mariadb binary directly for the purposes of importing dump files created with mysqldump. **\_This is by its nature, unsafe**,
so do take care when using it. The reason we're using this instead of the npm mysql-import package, is simple: that package implements its own parsing logic and is
not guaranteed to behave correctly. The mysql binary is guaranteed, so we need to bite the bullet and just accept that we'll be spawning processes and shoving data
into the binary stdin.

```typescript
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
  '/home/tourist/github_resume_projects/multidb/test/sqldumps_used_by_test/testdb.sql'
);
```

## MariaDB, why not PostgreSQL?

I use mariadb instead of mysql for most of my RDBMS requirements. The reason I don't use postgres, is mostly a legacy thing. Postgres wasn't particularly popular in the past, and I am paleolithic, and a lot of features felt like they were missing prior to recency, and long story short I'm not sure the juice would be worth the effort put into converting all my SQL into postgres. MariaDB does what I need, for what I need it for, and maybe in the future I'll consider postgresql but currently I'm fine with mariadb.

## MongoDB Streaming Events (watch)

To use streaming events your server must be configured to be a replication set. A single server can be a replication set, and there is virtually no downside to being configured in that state. However, a default install is not in that configuration.

If you want to enable a stand-alone replica set on your own database, follow the instructions below. Doing so will give you the ability to subscribe to change streams to monitor events live as they happen on the server.

First thing to be aware of is that if you have security enabled (you should), you'll need a keyfile for replica sets to work.

If you need to create your /etc/mongo-keyfile, use openssl as follows:

```bash
sudo openssl rand -base64 756 > /etc/mongo-keyfile
sudo chown mongodb:mongodb /etc/mongo-keyfile
sudo chmod 600 /etc/mongo-keyfile
```

```mongod.conf
security:
  authorization: enabled
  keyFile: /etc/mongo-keyfile
```

Edit your mongod configuration file to specify your replication set name (/etc/mongod.conf)

```mongod.conf
replication:
  replSetName: "rs0"
```

Restart the server:

```bash
sudo systemctl restart mongod
```

Initialize the single-node replica set (set ip or hostname to your preference).
This should be done locally on the machine using the mongosh command. The "your_ip_here" value must be the ip address of the machine itself, it cannot be 0.0.0.0. Localhost 127.0.0.1 works, but you have to specify actual reachable addresses.

```mongosh
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "your_ip_here:27017" }
  ]
})
```

If you want to edit/modify the member ip afterwards (from mongosh):

```mongosh
cfg = rs.conf();
cfg.members[0].host = "your_new_ip_here:27017";
rs.reconfig(cfg);
```

Verify the server is running as a replication set.

```mongosh
rs.status()
```

After you're done, you need to modify your connection string so that you specify the replicaset. If you're using mongo-compass, the advanced connection options -> advanced section allows you to specify the replica set directly.

Example modified connection string:

```
mongodb://youruser:yourpass@your_ip_here:27017/?authSource=admin&replicaSet=rs0
```

## Install

```bash
npm install @opsimathically/multidb
```

## Building from source

This package is intended to be run via npm, but if you'd like to build from source,
clone this repo, enter directory, and run `npm install` for dev dependencies, then run
`npm run build`.

## Usage

[See API Reference for documentation](https://github.com/opsimathically/multidb/tree/main/docs)

[See unit tests for more direct usage examples](https://github.com/opsimathically/multidb/blob/main/test/index.test.ts)
