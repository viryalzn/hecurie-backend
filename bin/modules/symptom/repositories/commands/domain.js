const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, ConflictError, BadRequestError } = require('../../../../helpers/error');
const uuid = require('uuid/v4');

class Symptom {

    constructor(db) {
        this.command = new Command(db);
        this.query = new Query(db);
    }

    async insertSymptom(payload) {
        const { symptomName, symptomCode, belief, category } = payload;

        const existingSymptom = await this.query.findOne({ symptomCode, isDeleted: false });
        if (existingSymptom.data) return wrapper.error(new ConflictError('Sudah ada gejala dengan kode ' + symptomCode));

        const date = new Date().toISOString();
        const plausability = 1 - belief;
        const data = {
            symptomId: uuid(),
            symptomCode,
            symptomName,
            belief: belief.toFixed(2),
            category,
            plausability: plausability.toFixed(2),
            isDeleted: false,
            createdAt: date,
            modifiedAt: date
        };

        const { data: result, err } = await this.command.insertOne(data);
        if (err) {
            return wrapper.error(new BadRequestError('Failed to add symptom.'));
        }

        return wrapper.data(result);
    }

    async updateSymptom(payload) {
        const ctx = 'domain-updateSymptom';
        const { symptomId, symptomName, belief, category } = payload;

        const symptom = await this.query.findOne({ symptomId, isDeleted: false });
        if (symptom.err) {
            logger.log(ctx, false, 'Symptom not found');
            return wrapper.error(new ConflictError('Symptom not found'));
        }

        const plausability = 1 - belief;
        const data = {
            $set: {
                symptomName,
                belief: belief.toFixed(2),
                category,
                plausability: plausability.toFixed(2),
                isDeleted: false,
                modifiedAt: new Date().toISOString()
            }
        };

        const updateSymptom = await this.command.upsertOne({ symptomId }, data);
        if (updateSymptom.err) {
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(updateSymptom.data);
    }

    async deleteSymptom(payload) {
        const ctx = 'domain-deleteSymptom';
        const { symptomId } = payload;

        const symptom = await this.query.findOne({
            symptomId
        });

        if (symptom.err) {
            logger.log(ctx, false, 'symptom can\'t be found..');
            return wrapper.error(new NotFoundError('symptom can\'t be found..'));
        }


        const document = {
            $set: {
                isDeleted: true,
                modifiedAt: new Date().toISOString()
            }
        };

        const { data: result, err } = await this.command.upsertOne({ symptomId }, document);
        if (err) {
            logger.log(ctx, 'Failed to update data.', err);
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(result);
    }
}

module.exports = Symptom;
