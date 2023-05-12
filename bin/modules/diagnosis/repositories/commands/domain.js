const Query = require('../queries/query');
const Command = require('./command');
const SymptomQuery = require('../../../symptom/repositories/queries/query');
const IllnessQuery = require('../../../illness/repositories/queries/query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, ConflictError, BadRequestError } = require('../../../../helpers/error');
const uuid = require('uuid/v4');
const {isEmpty} = require("validate.js");

class Diagnosis {

    constructor(db) {
        this.command = new Command(db);
        this.query = new Query(db);
        this.symptomQuery = new SymptomQuery(db);
        this.illnessQuery = new IllnessQuery(db);
    }

    async insertDiagnosis(payload) {

        const { patientName, patientAge, patientGender, symptomCode } = payload;
        const date = new Date().toISOString();
        let densitas = [];
        let index = 0;

        await Promise.all(symptomCode.map(async code => {
            const symptom = await this.symptomQuery.findOne({ symptomCode: code, isDeleted: false })
            const { belief, plausability, illnessCode } = symptom.data;

            // Membuat Nilai Densitas Berdasarkan Nilai Belief
            if (index === 1 || index === 0) {
                densitas.push([
                    { densitasName: 'm' + (densitas.length + 1) + '{' + illnessCode + '}', densitasValue: belief, illnessCode },
                    { densitasName: 'm' + (densitas.length + 1) + '{θ}', densitasValue: plausability, illnessCode: [ 'θ' ] }]);
            } else {
                densitas.push([
                    { densitasName: 'm' + (densitas.length + 1) + '{' + illnessCode + '}', densitasValue: belief, illnessCode },
                    { densitasName: 'm' + (densitas.length + 1) + '{θ}', densitasValue: plausability, illnessCode: [ 'θ' ] }]);
            }

            // Membuat Nilai Densitas Baru
            if (symptomCode.length > 1 && index > 0) {
                const newDensitas = [];
                let densitas1 = densitas[densitas.length - 2]
                let densitas2 = densitas[densitas.length - 1]
                let tempIllness = [];
                let conflict = 0;
                let union = [];

                for (var x in densitas1) {
                    const illnessesA = densitas2[0].illnessCode;
                    const illnessesB = densitas1[x].illnessCode;
                    const intersection = illnessesA.filter(member => illnessesB.includes(member));

                    if (isEmpty(intersection) && densitas1[x].illnessCode[0] !== 'θ') {
                        conflict = densitas1[x].densitasValue * densitas2[0].densitasValue;
                    }

                    if (densitas1[x].illnessCode[0] === 'θ') {
                        tempIllness.push({ illnessCode: illnessesA, densitasValue: densitas1[x].densitasValue * densitas2[0].densitasValue });
                        tempIllness.push({ illnessCode: illnessesB, densitasValue: densitas1[x].densitasValue * densitas2[1].densitasValue });
                    } else {
                        tempIllness.push({ illnessCode: intersection, densitasValue: densitas1[x].densitasValue * densitas2[0].densitasValue });
                        tempIllness.push({ illnessCode: illnessesB, densitasValue: densitas1[x].densitasValue * densitas2[1].densitasValue });
                    }
                }

                for (var x in tempIllness) {
                    let illness = [tempIllness[x].illnessCode]
                    union = union.concat(illness).filter((item, index, arr) => {
                        return index === arr.findIndex((elem) => {
                            return JSON.stringify(elem) === JSON.stringify(item);
                        });
                    });
                }

                for (var x in union) {
                    let temp = 0

                    for (var y in tempIllness) {
                        if (JSON.stringify(union[x]) === JSON.stringify(tempIllness[y].illnessCode)) {
                            temp = temp + tempIllness[y].densitasValue;
                        }
                    }

                    if (!isEmpty(union[x])) {
                        newDensitas.push({
                            densitasName: 'm' + (densitas.length + 1) + '{' + union[x] + '}',
                            densitasValue: temp / (1 - conflict),
                            illnessCode: union[x]
                        })
                    }
                }

                densitas.push(newDensitas);
            }
            index++;
        }));

        let maxDensitasValue = densitas[densitas.length - 1][0].densitasValue;
        let resultIllness = densitas[densitas.length - 1][0].illnessCode;
        let resultDiagnosis = [];

        await Promise.all(densitas.map(async data => {
            if (maxDensitasValue < data.densitasValue) {
                maxDensitasValue = data.densitasValue;
                resultIllness = data.illnessCode;
            }
        }));

        await Promise.all(resultIllness.map(async code => {
            const illness = await this.illnessQuery.findOne({ illnessCode: code, isDeleted: false })
            resultDiagnosis.push(illness.data.illnessName)
        }))

        const data = {
            patientId: uuid(),
            patientName,
            patientAge,
            patientGender,
            diagnosis: {
                confidence: (maxDensitasValue * 100),
                illnessName: resultDiagnosis
            },
            isDeleted: false,
            createdAt: date,
            modifiedAt: date
        }

        const { data: result, err } = await this.command.insertOne(data);
        if (err) {
            return wrapper.error(new BadRequestError('Failed to insert diagnosis.'));
        }

        return wrapper.data(result);
    }

    async updateDiagnosis(payload) {
        const ctx = 'domain-updateDiagnosis';
        const { diagnosisId, patientName } = payload;

        const diagnosis = await this.query.findOne({ diagnosisId, isDeleted: false });
        if (diagnosis.err) {
            logger.log(ctx, false, 'Diagnosis not found');
            return wrapper.error(new ConflictError('Diagnosis not found'));
        }

        const data = {
            $set: {
                patientName,
                isDeleted: false,
                modifiedAt: new Date().toISOString()
            }
        };

        const updateDiagnosis = await this.command.upsertOne({ diagnosisId }, data);
        if (updateDiagnosis.err) {
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(updateDiagnosis.data);
    }

    async deleteDiagnosis(payload) {
        console.log(payload)
        const ctx = 'domain-deleteDiagnosis';
        const { diagnosisId } = payload;

        const diagnosis = await this.query.findOne({
            diagnosisId
        });

        if (diagnosis.err) {
            logger.log(ctx, false, 'diagnosis can\'t be found..');
            return wrapper.error(new NotFoundError('diagnosis can\'t be found..'));
        }


        const document = {
            $set: {
                isDeleted: true,
                modifiedAt: new Date().toISOString()
            }
        };

        const { data: result, err } = await this.command.upsertOne({ diagnosisId }, document);
        if (err) {
            logger.log(ctx, 'Failed to update data.', err);
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(result);
    }
}

module.exports = Diagnosis;
