const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { BadRequestError, ConflictError} = require('../../../../helpers/error');
const validate = require('validate.js');

class Diagnosis {

    constructor(db) {
        this.query = new Query(db);
    }

    async listDiagnosis(payload) {
        const ctx = 'domain-getDiagnosis';
        payload.query.isDeleted = false;

        if (validate.isEmpty(payload.sort)) {
            payload.sort = { _id: 1 };
        }
        if (Object.keys(payload.sort).length > 1) {
            logger.log(ctx, 'sort object not allow to contain more than 1 property', '');
            return wrapper.error(new BadRequestError('sort object not allow to contain more than 1 property'));
        }

        delete payload.query.app;

        const aggregate = [
            { $match: payload.query },
            {
                $addFields: {
                    patientname: { $ifNull: ['patientName', ' '] },
                }
            },
            {
                $sort: payload.sort
            },
            { $skip: payload.size * (payload.page - 1) },
            // { $limit: payload.size }
        ];

        const diagnosis = await this.query.aggregate(aggregate);

        const countData = await this.query.countData(aggregate[0].$match);
        let result = diagnosis.data;
        if (diagnosis.err || countData.err) {
            countData.data = 0;
            result = [];
        }

        const metaData = {
            page: payload.page,
            // size: payload.size,
            dataLength: result.length,
            MaxData: countData.data,
            MaxPage: Math.ceil(countData.data / payload.size)
        };
        return wrapper.paginationData(result, metaData);
    }

    async getDiagnosis(payload) {
        const { data: result, err } = await this.query.findOne(payload);
        if (err) return wrapper.error(new ConflictError('Diagnosis not found'));

        return wrapper.data(result);
    }
}

module.exports = Diagnosis;
