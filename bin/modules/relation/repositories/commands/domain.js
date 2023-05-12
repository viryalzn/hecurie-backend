const Query = require('../queries/query');
const Command = require('./command');
const SymptomQuery = require('../../../symptom/repositories/queries/query');
const SymptomCommand = require('../../../symptom/repositories/commands/command');
const IllnessQuery = require('../../../illness/repositories/queries/query');
const IllnessCommand = require('../../../illness/repositories/commands/command');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, ConflictError, BadRequestError } = require('../../../../helpers/error');
const uuid = require('uuid/v4');

class Relation {

    constructor(db) {
        this.command = new Command(db);
        this.query = new Query(db);
        this.symptomQuery = new SymptomQuery(db);
        this.symptomCommand = new SymptomCommand(db);
        this.illnessQuery = new IllnessQuery(db);
        this.illnessCommand = new IllnessCommand(db);
    }

    async insertRelation(payload) {
        const { illnessCode, symptomCode } = payload;

        const existingIllness = await this.query.findOne({ 'illness.illnessCode': illnessCode, isDeleted: false });
        if (existingIllness.data) return wrapper.error(new ConflictError('Penyakit sudah memiliki relasi, silahkan edit gejala pada penyakit tersebut'));

        const illness = await this.illnessQuery.findOne({ illnessCode, isDeleted: false });
        const symptoms = [];

        await Promise.all(symptomCode.map(async code => {
            const symptom = await this.symptomQuery.findOne({ symptomCode: code, isDeleted: false })

            symptoms.push({ symptomCode: code, symptomName: symptom.data.symptomName })
        }));

        const date = new Date().toISOString();
        const data = {
            relationId: uuid(),
            illness: {
                illnessCode,
                illnessName: illness.data.illnessName
            },
            symptoms,
            isDeleted: false,
            createdAt: date,
            modifiedAt: date
        };

        const { data: result, err } = await this.command.insertOne(data);
        if (err) {
            return wrapper.error(new BadRequestError('Failed to add relation.'));
        }

        await Promise.all(symptomCode.map(async code => {
            const symptom = await this.symptomQuery.findOne({ symptomCode: code, isDeleted: false })

            let newIllnessCode = [illnessCode];

            if (symptom.data.illnessCode) {
                for (var x in symptom.data.illnessCode) {
                    if (symptom.data.illnessCode[x] !== illnessCode) {
                        newIllnessCode.push(symptom.data.illnessCode[x])
                    }
                }
            }

            const data = {
              $set: {
                  illnessCode: newIllnessCode.sort()
              }
            };

            await this.symptomCommand.upsertOne({ symptomId: symptom.data.symptomId }, data);
        }));

        return wrapper.data(result);
    }

    async updateRelation(payload) {
        // INI MASIH BELUM DI ATUR BUAT SET KE DB SYMPTOM
        const ctx = 'domain-updateRelation';
        const { relationId, symptomCode } = payload;
        const oldSymptoms = [];
        const symptoms = [];

        const relation = await this.query.findOne({ relationId, isDeleted: false });
        if (relation.err) {
            logger.log(ctx, false, 'Relation not found');
            return wrapper.error(new ConflictError('Relation not found'));
        }

        await Promise.all(relation.data.symptoms.map(async symptom => {
            oldSymptoms.push(symptom.symptomCode);
        }));

        await Promise.all(symptomCode.map(async code => {
            const symptom = await this.symptomQuery.findOne({ symptomCode: code, isDeleted: false });

            symptoms.push({ symptomCode: code, symptomName: symptom.data.symptomName });
        }));

        const symptomsDeleted = oldSymptoms.filter(member => !symptomCode.includes(member));
        const symptomAdded = symptomCode.filter(member => !oldSymptoms.includes(member));

        const data = {
            $set: {
                symptoms,
                isDeleted: false,
                modifiedAt: new Date().toISOString()
            }
        };

        const updateRelation = await this.command.upsertOne({ relationId }, data);
        if (updateRelation.err) {
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        await Promise.all(symptomsDeleted.map(async symptom => {
            const existingSymptom = await this.symptomQuery.findOne({ symptomCode: symptom, isDeleted: false});
            const oldIllness = existingSymptom.data.illnessCode;
            const illnessDeleted = relation.data.illness.illnessCode;
            const newIllnesses = oldIllness.filter(e => e !== illnessDeleted);

            const updateIllness = {
                $set: {
                    illnessCode: newIllnesses
                }
            };

            await this.symptomCommand.upsertOne({ symptomId: existingSymptom.data.symptomId }, updateIllness);
        }));

        await Promise.all(symptomAdded.map(async symptom => {
            const existingSymptom = await this.symptomQuery.findOne({ symptomCode: symptom, isDeleted: false});
            const illness = existingSymptom.data.illnessCode;
            const illnessAdded = relation.data.illness.illnessCode;
            illness.push(illnessAdded);

            const updateIllness = {
                $set: {
                    illnessCode: illness
                }
            };

            await this.symptomCommand.upsertOne({ symptomId: existingSymptom.data.symptomId }, updateIllness);
            console.log('masuktambah')
        }));

        return wrapper.data(updateRelation.data);
    }

    async deleteRelation(payload) {
        console.log(payload)
        const ctx = 'domain-deleteRelation';
        const { relationId } = payload;
        const symptoms = [];

        const relation = await this.query.findOne({
            relationId
        });

        if (relation.err) {
            logger.log(ctx, false, 'relation can\'t be found..');
            return wrapper.error(new NotFoundError('relation can\'t be found..'));
        }

        await Promise.all(relation.data.symptoms.map(async symptom => {
            symptoms.push(symptom.symptomCode);
        }));

        const document = {
            $set: {
                isDeleted: true,
                modifiedAt: new Date().toISOString()
            }
        };

        const { data: result, err } = await this.command.upsertOne({ relationId }, document);
        if (err) {
            logger.log(ctx, 'Failed to update data.', err);
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        await Promise.all(symptoms.map(async symptom => {
            const existingSymptom = await this.symptomQuery.findOne({ symptomCode: symptom, isDeleted: false});
            const oldIllness = existingSymptom.data.illnessCode;
            const illnessDeleted = relation.data.illness.illnessCode;
            const newIllnesses = oldIllness.filter(e => e !== illnessDeleted);

            const updateIllness = {
                $set: {
                    illnessCode: newIllnesses
                }
            };

            await this.symptomCommand.upsertOne({ symptomId: existingSymptom.data.symptomId }, updateIllness);
        }));

        return wrapper.data(result);
    }
}

module.exports = Relation;
