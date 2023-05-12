const joi = require('joi');
const uuid = require('uuid').v4;
const config = require('../../../../infra/configs/global_config');
const Joi = require("joi");


const insertIllness = () => {
    return joi.object({
        illnessId: joi.string().forbidden().default(uuid()),
        illnessCode: Joi.string().optional(),
        illnessName: joi.string().required(),
        explanation: joi.string().required(),
        solution: joi.string().required(),
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

const deleteIllness = () => {
    return joi.object({
        illnessId: joi.string().required()
    });
};


module.exports = {
    insertIllness,
    updateIllness,
    deleteIllness
};
