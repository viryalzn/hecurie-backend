const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { BadRequestError, ConflictError} = require('../../../../helpers/error');
const validate = require('validate.js');

class Illness {

  constructor(db) {
    this.query = new Query(db);
  }

    async listIllness(payload) {
        const ctx = 'domain-getIllness';
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
                    illnessName: { $ifNull: ['$illnessName', '$explanation'] },
                }
            },
            {
                $sort: payload.sort
            },
            { $skip: payload.size * (payload.page - 1) },
            { $limit: payload.size }
        ];

        const illness = await this.query.aggregate(aggregate);
        console.log(illness)

        const countData = await this.query.countData(aggregate[0].$match);
        let result = illness.data;
        if (illness.err || countData.err) {
            countData.data = 0;
            result = [];
        }

        const metaData = {
            page: payload.page,
            size: payload.size,
            dataLength: result.length,
            MaxData: countData.data,
            MaxPage: Math.ceil(countData.data / payload.size)
        };
        return wrapper.paginationData(result, metaData);
    }

    async getIllness(payload) {
        const { data: result, err } = await this.query.findOne(payload);
        if (err) return wrapper.error(new ConflictError('Illness not found'));

        return wrapper.data(result);
    }
}

module.exports = Illness;
