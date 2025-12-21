[**@opsimathically/multidb**](../README.md)

***

[@opsimathically/multidb](../README.md) / MongoDB

# Class: MongoDB

Defined in: [src/classes/mongodb/MongoDB.class.ts:70](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L70)

## Constructors

### Constructor

> **new MongoDB**(): `MongoDB`

Defined in: [src/classes/mongodb/MongoDB.class.ts:73](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L73)

#### Returns

`MongoDB`

## Properties

### known\_indexes

> **known\_indexes**: `Record`\<`string`, `boolean`\> = `{}`

Defined in: [src/classes/mongodb/MongoDB.class.ts:72](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L72)

***

### MongoClient

> **MongoClient**: `MongoClient` \| `null` = `null`

Defined in: [src/classes/mongodb/MongoDB.class.ts:71](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L71)

## Methods

### aggregateCollection()

> **aggregateCollection**(`params`): `Promise`\<`boolean` \| `Document`[]\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:503](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L503)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:562](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L562)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:201](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L201)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:76](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L76)

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

###### replicaSet?

`string`

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:448](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L448)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:405](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L405)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:361](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L361)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:225](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L225)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:186](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L186)

#### Parameters

##### db\_name

`string`

#### Returns

`Promise`\<`boolean` \| `null`\>

***

### deleteCollection()

> **deleteCollection**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:429](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L429)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:386](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L386)

#### Parameters

##### db\_name

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deleteIndexFromCollection()

> **deleteIndexFromCollection**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:282](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L282)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:914](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L914)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:892](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L892)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:131](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L131)

#### Returns

`Promise`\<`boolean`\>

***

### distinctValues()

> **distinctValues**(`params`): `Promise`\<`any`[] \| `null`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:864](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L864)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:471](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L471)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:807](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L807)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:784](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L784)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:152](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L152)

#### Returns

`Promise`\<`mongodb_databases_t` \| `null`\>

***

### GFS\_createBucket()

> **GFS\_createBucket**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:1047](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1047)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1092](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1092)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1319](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1319)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1284](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1284)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1188](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1188)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1114](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1114)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1353](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1353)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1415](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1415)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1500](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1500)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:1476](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L1476)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:313](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L313)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:705](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L705)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:682](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L682)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:620](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L620)

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

### subscribeToCollectionChangeStream()

> **subscribeToCollectionChangeStream**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:987](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L987)

#### Parameters

##### params

###### collection

`string`

###### db

`string`

###### event_handler

[`coll_change_stream_handler_t`](../interfaces/coll_change_stream_handler_t.md)

#### Returns

`Promise`\<`boolean`\>

***

### subscribeToDatabaseChangeStream()

> **subscribeToDatabaseChangeStream**(`params`): `Promise`\<`boolean`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:951](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L951)

#### Parameters

##### params

###### db

`string`

###### event_handler

[`db_change_stream_handler_t`](../interfaces/db_change_stream_handler_t.md)

#### Returns

`Promise`\<`boolean`\>

***

### updateRecords()

> **updateRecords**(`params`): `Promise`\<`UpdateResult`\<`Document`\> \| `null`\>

Defined in: [src/classes/mongodb/MongoDB.class.ts:756](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L756)

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

Defined in: [src/classes/mongodb/MongoDB.class.ts:728](https://github.com/opsimathically/multidb/blob/8700cbe01071e0f07ae4d5e8d6a9f8c3182de939/src/classes/mongodb/MongoDB.class.ts#L728)

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
