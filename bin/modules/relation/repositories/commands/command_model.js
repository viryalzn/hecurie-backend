const joi = require('joi');
const uuid = require('uuid').v4;
const config = require('../../../../infra/configs/global_config');
const Joi = require("joi");


const insertRelation = () => {
    return joi.object({
        relationId: joi.string().forbidden().default(uuid()),
        illnessCode: joi.string().required(),
        symptomCode: joi.array().items(joi.string()).min(1).required(),
        isDeleted: joi.bool().forbidden().default(false),
        createdAt: joi.string().forbidden().default(new Date().toISOString()),
        createdBy: joi.string().forbidden().default(''),
        modifiedAt: joi.string().forbidden().default(new Date().toISOString()),
        modifiedBy: joi.string().forbidden().default('')
    });
};

const updateRelation = () => {
    return joi.object().keys({
        relationId: joi.string().guid().required(),
        symptomCode: joi.array().items(joi.string()).required(),
        isDeleted: joi.bool().optional()
    });
};

const deleteRelation = () => {
    return joi.object({
        relationId: joi.string().required()
    });
};


module.exports = {
    insertRelation,
    updateRelation,
    deleteRelation
};
