
const validate = require('validate.js');
const mongoConnection = require('./connection');
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');

class DB {
    constructor(config) {
        this.config = config;
    }

    setCollection(collectionName) {
        this.collectionName = collectionName;
    }

    async getDatabase() {
        const config = this.config.replace('//', '');
        /* eslint no-useless-escape: "error" */
        const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
        const dbName = pattern.exec(config);
        return dbName[1];
    }

    async findOne(parameter) {
        const ctx = 'mongodb-findOne';
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.findOne(parameter);
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error find data in mongodb');
            return wrapper.error(`Error Find One Mongo ${err.message}`);
        }
    }

    async findMany(parameter) {
        const ctx = 'mongodb-findMany';
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.find(parameter).toArray();
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found , Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error find data in mongodb');
            return wrapper.error(`Error Find Many Mongo ${err.message}`);
        }
    }

    async insertOne(document) {
        const ctx = 'mongodb-insertOne';
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.insertOne(document);
            if (recordset.result.n !== 1) {
                return wrapper.error('Failed Inserting Data to Database');
            }
            return wrapper.data(document);

        } catch (err) {
            logger.log(ctx, err.message, 'Error insert data in mongodb');
            return wrapper.error(`Error Insert One Mongo ${err.message}`);
        }
    }

    async insertMany(data) {
        const ctx = 'mongodb-insertMany';
        const document = data;
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.insertMany(document);
            if (recordset.result.n < 1) {
                return wrapper.error('Failed Inserting Data to Database');
            }
            return wrapper.data(document);

        } catch (err) {
            logger.log(ctx, err.message, 'Error insert data in mongodb');
            return wrapper.error(`Error Insert Many Mongo ${err.message}`);
        }
    }

    // nModified : 0 => data created
    // nModified : 1 => data updated
    async upsertOne(parameter, updateQuery) {
        const ctx = 'mongodb-upsertOne';
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const data = await db.findOneAndUpdate(parameter, updateQuery, { returnDocument: 'after', upsert: true });
            if (data.lastErrorObject.n >= 1) {
                return wrapper.data(data.value);
            }
            return wrapper.error('Failed upsert data');
        } catch (err) {
            logger.log(ctx, err.message, 'Error upsert data in mongodb');
            return wrapper.error(`Error Upsert Mongo ${err.message}`);
        }
    }

    async upsertMany(parameter, updateQuery) {
        const ctx = 'mongodb-upsertOne';
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const data = await db.updateMany(parameter, updateQuery, { multi: true });
            if (data.result.nModified >= 0) {
                const { result: { nModified } } = data;
                const recordset = await this.findOne(parameter);
                if (nModified === 0) {
                    return wrapper.data(recordset.data);
                }
                return wrapper.data(recordset.data);
            }
            return wrapper.error('Failed upsert data');
        } catch (err) {
            logger.log(ctx, err.message, 'Error upsert many data in mongodb');
            return wrapper.error(`Error Upsert Mongo ${err.message}`);
        }
    }

    async updateMany(parameter, updateQuery) {
        const ctx = 'mongodb-updateMany';
        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const data = await db.updateMany(parameter, updateQuery);
            if (data.result.nModified >= 1) {
                const recordset = await db.find(parameter).toArray();
                if (validate.isEmpty(recordset)) {
                    return wrapper.error('Data Not Found , Please Try Another Input');
                }
                return wrapper.data(recordset);
            }
            return wrapper.error('Failed update data');
        } catch (err) {
            logger.log(ctx, err.message, 'Error updateMany data in mongodb');
            return wrapper.error(`Error updateMany Mongo ${err.message}`);
        }

    }

    async findAllData(fieldName, row, page, param) {
        const ctx = 'mongodb-findAllData';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const parameterSort = {};
            parameterSort[fieldName] = 1;
            const parameterPage = row * (page - 1);
            const recordset = await db.find(param).sort(parameterSort).limit(row).skip(parameterPage)
                .toArray();
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found, Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error upsert data in mongodb');
            return wrapper.error(`Error Mongo ${err.message}`);
        }
    }

    async countData(param) {
        const ctx = 'mongodb-countData';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.countDocuments(param);
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found , Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error count data in mongodb');
            return wrapper.error(`Error Mongo ${err.message}`);
        }
    }

    async findProjection(parameter, page, limit) {
        const ctx = 'mongodb-findProjection';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const parameterPage = limit * (page - 1);
            const recordset = await db.find(parameter.query, {projection: parameter.projection})
                .sort(parameter.sort).limit(limit).skip(parameterPage).toArray();
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found, Please Try Another Input', 404);
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error find data in mongodb');
            return wrapper.error('Error Mongo', `${err.message}`, 409);
        }
    }

    async findOneProject(parameter, projection) {
        const ctx = 'mongodb-findOne';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.findOne(parameter, { projection });
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error find data in mongodb');
            return wrapper.error(`Error Find One Mongo ${err.message}`);
        }

    }

    async distinct(field, param) {
        const ctx = 'mongodb-distinct';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.distinct(field, param);
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found , Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error count data in mongodb');
            return wrapper.error(`Error Mongo ${err.message}`);
        }
    }

    async aggregate(param) {
        const ctx = 'mongodb-aggregate';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const recordset = await db.aggregate(param).toArray();
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found , Please Try Another Input');
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error count data in mongodb');
            return wrapper.error(`Error Mongo ${err.message}`);
        }
    }

    async findProjectionCollation(parameter, page, limit) {
        const ctx = 'mongodb-findProjection';

        const result = await mongoConnection.getConnection(this.config);
        if (result.err) {
            logger.log(ctx, result.err.message, 'Error mongodb connection');
            return result;
        }
        try {
            const cacheConnection = result.data.db;
            const connection = cacheConnection.db();
            const db = connection.collection(this.collectionName);
            const parameterPage = limit * (page - 1);
            const recordset = await db.find(parameter.query, {
                projection: parameter.projection,
                collation: { locale: 'en_US' }
            }).sort(parameter.sort).limit(limit).skip(parameterPage).toArray();
            if (validate.isEmpty(recordset)) {
                return wrapper.error('Data Not Found, Please Try Another Input', 404);
            }
            return wrapper.data(recordset);

        } catch (err) {
            logger.log(ctx, err.message, 'Error find data in mongodb');
            return wrapper.error('Error Mongo', `${err.message}`, 409);
        }
    }

}

module.exports = DB;
