const joi = require('joi');
const uuid = require('uuid').v4;
const config = require('../../../../infra/configs/global_config');
const Joi = require("joi");


const insertSymptom = () => {
    return joi.object({
        symptomId: joi.string().forbidden().default(uuid()),
        symptomCode: Joi.string().required(),
        symptomName: joi.string().required(),
        belief: joi.number().required(),
        category: joi.string().required(),
        isDeleted: joi.bool().forbidden().default(false),
        createdAt: joi.string().forbidden().default(new Date().toISOString()),
        createdBy: joi.string().forbidden().default(''),
        modifiedAt: joi.string().forbidden().default(new Date().toISOString()),
        modifiedBy: joi.string().forbidden().default('')
    });
};

const updateSymptom = () => {
    return joi.object().keys({
        symptomId: joi.string().guid().required(),
        symptomName: joi.string().required(),
        belief: joi.number().required(),
        category: joi.string().required(),
        isDeleted: joi.bool().optional()
    });
};

const deleteSymptom = () => {
    return joi.object({
        symptomId: joi.string().required()
    });
};


module.exports = {
    insertSymptom,
    updateSymptom,
    deleteSymptom
};
