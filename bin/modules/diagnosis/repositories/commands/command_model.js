const joi = require('joi');
const uuid = require('uuid').v4;
const config = require('../../../../infra/configs/global_config');
const Joi = require("joi");

const insertBiodata = () => {
    return joi.object({
        patientId: joi.string().forbidden().default(uuid()),
        patientName: joi.string().required(),
        patientAge: joi.number.required(),
        patientGender: joi.string().required()
    });
}

const insertDiagnosis = () => {
    return joi.object({
        patientId: joi.string().forbidden().default(uuid()),
        patientName: joi.string().required(),
        patientAge: joi.number().required(),
        patientGender: joi.string().required(),
        symptomCode: joi.array().items(joi.string()).required(),
        isDeleted: joi.bool().forbidden().default(false),
        createdAt: joi.string().forbidden().default(new Date().toISOString()),
        createdBy: joi.string().forbidden().default(''),
        modifiedAt: joi.string().forbidden().default(new Date().toISOString()),
        modifiedBy: joi.string().forbidden().default('')
    });
};

const updateIllness = () => {
    return joi.object().keys({
        illnessId: joi.string().guid().required(),
        illnessName: joi.string().required(),
        explanation: joi.string().required(),
        solution: joi.string().required(),
        isDeleted: joi.bool().optional()
    });
};

const deleteDiagnosis = () => {
    return joi.object({
        patientId: joi.string().required()
    });
};


module.exports = {
    insertBiodata,
    insertDiagnosis,
    updateIllness,
    deleteDiagnosis
};
