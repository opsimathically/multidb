[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MongoDB

# Class: MongoDB

Defined in: MongoDB.class.ts:45

## Constructors

### Constructor

> **new MongoDB**(): `MongoDB`

Defined in: MongoDB.class.ts:48

#### Returns

`MongoDB`

## Properties

### known\_indexes

> **known\_indexes**: `Record`\<`string`, `boolean`\> = `{}`

Defined in: MongoDB.class.ts:47

***

### MongoClient

> **MongoClient**: `MongoClient` \| `null` = `null`

Defined in: MongoDB.class.ts:46

## Methods

### aggregateCollection()

> **aggregateCollection**(`params`): `Promise`\<`boolean` \| `Document`[]\>

Defined in: MongoDB.class.ts:476

#### Parameters

##### params

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"`\>

###### collection

`string`

###### db

`string`

###### options?

`AggregateOptions`

###### pipeline

`Document`[]

#### Returns

`Promise`\<`boolean` \| `Document`[]\>

***

### aggregateDB()

> **aggregateDB**(`params`): `Promise`\<`boolean` \| `Document`[]\>

Defined in: MongoDB.class.ts:535

#### Parameters

##### params

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"`\>

###### db

`string`

###### options?

`AggregateOptions`

###### pipeline

`Document`[]

#### Returns

`Promise`\<`boolean` \| `Document`[]\>

***

### collectionExists()

> **collectionExists**(`db_name`, `collection_name`): `Promise`\<`boolean` \| `null`\>

Defined in: MongoDB.class.ts:174

#### Parameters

##### db\_name

`string`

##### collection\_name

`string`

#### Returns

`Promise`\<`boolean` \| `null`\>

***

### connect()

> **connect**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:51

#### Parameters

##### params

###### authdb

`string`

###### host

`string`

###### maxPoolSize?

`number`

###### password

`string`

###### port

`number`

###### tls?

`boolean`

###### tlsInsecure?

`boolean`

###### username

`string`

#### Returns

`Promise`\<`boolean`\>

***

### countDocuments()

> **countDocuments**(`params`): `Promise`\<`number`\>

Defined in: MongoDB.class.ts:421

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### filter

`Filter`\<`Document`\>

###### options?

`CountDocumentsOptions`

#### Returns

`Promise`\<`number`\>

***

### createCollection()

> **createCollection**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:378

#### Parameters

##### params

###### collection

`string`

###### db

`string`

#### Returns

`Promise`\<`boolean`\>

***

### createDatabase()

> **createDatabase**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:334

#### Parameters

##### params

###### info

\{ `description`: `string`; `extra?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \}

###### info.description

`string`

###### info.extra?

`Record`\<`string`, `string` \| `number` \| `boolean`\>

###### name

`string`

#### Returns

`Promise`\<`boolean`\>

***

### createIndexOnCollection()

> **createIndexOnCollection**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:198

#### Parameters

##### params

###### collection

`string` \| `undefined`

###### db

`string`

###### skip_local_cache_lookup?

`boolean`

###### spec

`IndexSpecification`

###### unique

`boolean` \| `undefined`

#### Returns

`Promise`\<`boolean`\>

***

### databaseExists()

> **databaseExists**(`db_name`): `Promise`\<`boolean` \| `null`\>

Defined in: MongoDB.class.ts:159

#### Parameters

##### db\_name

`string`

#### Returns

`Promise`\<`boolean` \| `null`\>

***

### deleteCollection()

> **deleteCollection**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:402

#### Parameters

##### params

###### collection

`string`

###### db

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deleteDatabase()

> **deleteDatabase**(`db_name`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:359

#### Parameters

##### db\_name

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deleteIndexFromCollection()

> **deleteIndexFromCollection**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:255

#### Parameters

##### params

###### collection

`string` \| `undefined`

###### db

`string`

###### spec

`IndexSpecification`

#### Returns

`Promise`\<`boolean`\>

***

### deleteRecords()

> **deleteRecords**(`params`): `Promise`\<`DeleteResult` \| `null`\>

Defined in: MongoDB.class.ts:887

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`DeleteResult` \| `null`\>

***

### deleteSingleRecord()

> **deleteSingleRecord**(`params`): `Promise`\<`DeleteResult` \| `null`\>

Defined in: MongoDB.class.ts:865

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`DeleteResult` \| `null`\>

***

### disconnect()

> **disconnect**(): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:104

#### Returns

`Promise`\<`boolean`\>

***

### distinctValues()

> **distinctValues**(`params`): `Promise`\<`any`[] \| `null`\>

Defined in: MongoDB.class.ts:837

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

###### key

`string`

###### options

`DistinctOptions`

#### Returns

`Promise`\<`any`[] \| `null`\>

***

### estimatedDocumentCount()

> **estimatedDocumentCount**(`params`): `Promise`\<`number`\>

Defined in: MongoDB.class.ts:444

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### options

`EstimatedDocumentCountOptions`

#### Returns

`Promise`\<`number`\>

***

### findRecords()

> **findRecords**(`params`): `Promise`\<`WithId`\<`Document`\>[] \| `null`\>

Defined in: MongoDB.class.ts:780

#### Parameters

##### params

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"`\>

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

###### options?

`FindOptions`

#### Returns

`Promise`\<`WithId`\<`Document`\>[] \| `null`\>

***

### findSingleRecord()

> **findSingleRecord**(`params`): `Promise`\<`WithId`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:757

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`WithId`\<`Document`\> \| `null`\>

***

### gatherDatabasesAndCollections()

> **gatherDatabasesAndCollections**(): `Promise`\<`mongodb_databases_t` \| `null`\>

Defined in: MongoDB.class.ts:125

#### Returns

`Promise`\<`mongodb_databases_t` \| `null`\>

***

### GFS\_createBucket()

> **GFS\_createBucket**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:932

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

#### Returns

`Promise`\<`boolean`\>

***

### GFS\_deleteBucket()

> **GFS\_deleteBucket**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:977

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

#### Returns

`Promise`\<`boolean`\>

***

### GFS\_deleteFiles()

> **GFS\_deleteFiles**(`params`): `Promise`\<`number`\>

Defined in: MongoDB.class.ts:1203

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`number`\>

***

### GFS\_deleteSingleFile()

> **GFS\_deleteSingleFile**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:1168

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`boolean`\>

***

### GFS\_findFiles()

> **GFS\_findFiles**(`params`): `Promise`\<`file_data_t`[] \| `null`\>

Defined in: MongoDB.class.ts:1073

#### Parameters

##### params

###### bucket_name

`string`

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"` \| `"nextfile"`\>

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`file_data_t`[] \| `null`\>

***

### GFS\_findSingleFileGFS()

> **GFS\_findSingleFileGFS**(`params`): `Promise`\<`file_data_t`\>

Defined in: MongoDB.class.ts:999

#### Parameters

##### params

###### bucket_name

`string`

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"`\>

###### db

`string`

###### find

`Filter`\<`Document`\>

#### Returns

`Promise`\<`file_data_t`\>

***

### GFS\_storeFileFromBuffer()

> **GFS\_storeFileFromBuffer**(`params`): `Promise`\<`ObjectId` \| `null`\>

Defined in: MongoDB.class.ts:1237

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

###### file_content_buffer

`Buffer`

###### file_metadata

`Document`

###### filename

`string`

#### Returns

`Promise`\<`ObjectId` \| `null`\>

***

### GFS\_storeFileFromStream()

> **GFS\_storeFileFromStream**(`params`): `Promise`\<`ObjectId` \| `null`\>

Defined in: MongoDB.class.ts:1298

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

###### file_content_stream

`Readable`

###### file_metadata

`Document`

###### filename

`string`

#### Returns

`Promise`\<`ObjectId` \| `null`\>

***

### GFS\_updateFilesMetadata()

> **GFS\_updateFilesMetadata**(`params`): `Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:1383

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

###### update

`Document`[] \| `UpdateFilter`\<`Document`\>

#### Returns

`Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

***

### GFS\_updateSingleFileMetadata()

> **GFS\_updateSingleFileMetadata**(`params`): `Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:1359

#### Parameters

##### params

###### bucket_name

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

###### update

`Document`[] \| `UpdateFilter`\<`Document`\>

#### Returns

`Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

***

### indexAlreadyExists()

> **indexAlreadyExists**(`params`): `Promise`\<`boolean`\>

Defined in: MongoDB.class.ts:286

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### spec

`IndexSpecification`

#### Returns

`Promise`\<`boolean`\>

***

### insertRecords()

> **insertRecords**(`params`): `Promise`\<`InsertManyResult`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:678

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### records

readonly `OptionalId`\<`Document`\>[]

###### write_options?

`BulkWriteOptions`

#### Returns

`Promise`\<`InsertManyResult`\<`Document`\> \| `null`\>

***

### insertSingleRecord()

> **insertSingleRecord**(`params`): `Promise`\<`InsertOneResult`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:655

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### record

`OptionalId`\<`Document`\>

###### write_options?

`BulkWriteOptions`

#### Returns

`Promise`\<`InsertOneResult`\<`Document`\> \| `null`\>

***

### randomSampleFromCollection()

> **randomSampleFromCollection**(`params`): `Promise`\<`Document`[] \| `null`\>

Defined in: MongoDB.class.ts:593

#### Parameters

##### params

###### cb?

(`params`) => `Promise`\<`void` \| `"breakloop"`\>

###### collection

`string`

###### db

`string`

###### sample_size_n

`number`

#### Returns

`Promise`\<`Document`[] \| `null`\>

***

### updateRecords()

> **updateRecords**(`params`): `Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:729

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

###### update

`Document`[] \| `UpdateFilter`\<`Document`\>

###### update_options?

`UpdateOptions`

#### Returns

`Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

***

### updateSingleRecord()

> **updateSingleRecord**(`params`): `Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

Defined in: MongoDB.class.ts:701

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### find

`Filter`\<`Document`\>

###### update

`Document`[] \| `UpdateFilter`\<`Document`\>

###### update_options?

`UpdateOptions`

#### Returns

`Promise`\<`UpdateResult`\<`Document`\> \| `null`\>
