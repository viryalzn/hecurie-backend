const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, ConflictError, BadRequestError } = require('../../../../helpers/error');
const uuid = require('uuid/v4');

class Post {

    constructor(db) {
        this.command = new Command(db);
        this.query = new Query(db);
    }

    async insertIllness(payload) {
        const { illnessName, illnessCode, explanation, solution } = payload;

        const date = new Date().toISOString();
        const data = {
            illnessId : uuid(),
            illnessCode,
            illnessName,
            explanation,
            solution,
            isDeleted: false,
            createdAt: date,
            modifiedAt: date
        };

        const { data: result, err } = await this.command.insertOne(data);
        if (err) {
            return wrapper.error(new BadRequestError('Failed to add illness.'));
        }

        return wrapper.data(result);
    }

    async updateIllness(payload) {
        const ctx = 'domain-updateIllness';
        const { illnessId, illnessName, explanation, solution } = payload;

        const illness = await this.query.findOne({ illnessId });
        if (illness.err) {
            logger.log(ctx, false, 'Illness not found');
            return wrapper.error(new ConflictError('Illness not found'));
        }

        const data = {
            $set: {
                illnessName,
                explanation,
                solution,
                isDeleted: false,
                modifiedAt: new Date().toISOString()
            }
        };

        const updateIllness = await this.command.upsertOne({ illnessId }, data);
        if (updateIllness.err) {
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(updateIllness.data);
    }

    async deleteIllness(payload) {
        console.log(payload)
        const ctx = 'domain-deleteIllness';
        const { illnessId } = payload;

        const illness = await this.query.findOne({
            illnessId
        });

        if (illness.err) {
            logger.log(ctx, false, 'illness can\'t be found..');
            return wrapper.error(new NotFoundError('illness can\'t be found..'));
        }


        const document = {
            $set: {
                isDeleted: true,
                modifiedAt: new Date().toISOString()
            }
        };

        const { data: result, err } = await this.command.upsertOne({ illnessId }, document);
        if (err) {
            logger.log(ctx, 'Failed to update data.', err);
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(result);
    }
}

module.exports = Post;
