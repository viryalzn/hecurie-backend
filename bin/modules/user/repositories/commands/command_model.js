const joi = require('joi');
const uuid = require('uuid').v4;
const config = require('../../../../infra/configs/global_config');
const Joi = require("joi");


const registerUser = () => {
    return joi.object({
        userId: joi.string().forbidden().default(uuid()),
        email: joi.string().required(),
        username: Joi.string().required(),
        password: joi.string().required(),
        adminName: joi.string().required(),
        isDeleted: joi.bool().forbidden().default(false),
        createdAt: joi.string().forbidden().default(new Date().toISOString()),
        createdBy: joi.string().forbidden().default(''),
        modifiedAt: joi.string().forbidden().default(new Date().toISOString()),
        modifiedBy: joi.string().forbidden().default('')
    });
};

const login = () => {
    return joi.object({
        username: Joi.string().required(),
        password: joi.string().required(),
    });
};

const updateUser = () => {
    return joi.object().keys({
        userId: joi.string().guid().required(),
        adminName: joi.string().required(),
        username: joi.string().required(),
        email: joi.string().required()
    });
};

const changePassword = () => {
    return joi.object().keys({
        userId: joi.string().guid().required(),
        oldPassword: joi.string().required(),
        newPassword: joi.string().required()
    });
};

const deleteUser = () => {
    return joi.object({
        userId: joi.string().required()
    });
};


module.exports = {
    registerUser,
    login,
    updateUser,
    changePassword,
    deleteUser
};
