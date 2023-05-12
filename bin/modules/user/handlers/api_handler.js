const commandHandler = require('../repositories/commands/command_handler');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const queryModel = require('../repositories/queries/query_model');
const validator = require('../../../helpers/utils/validator');
const { sendResponse, paginationResponse } = require('../../../helpers/utils/response');

/* Command */

const registerUser = async (req, res) => {
    const ctx = 'apiHandler-registerUser';
    const { body: payload } = req;
    const validate = await validator.isValidPayload(payload, commandModel.registerUser());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.registerUser({ ...data });
    return sendResponse(result, res, 'Hooray, The User is Successfully Registered');
};

const login = async (req, res) => {
    const ctx = 'apiHandler-login';
    const { body: payload } = req;
    const validate = await validator.isValidPayload(payload, commandModel.login());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.login({ ...data });
    return sendResponse(result, res, 'Hooray, Successfully Loged In');
};

const updateUser = async (req, res) => {
    const payload = req.body;
    const validate = await validator.isValidPayload(payload, commandModel.updateUser());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.updateUser(data);
    return sendResponse(result, res, 'Hooray, User Data is Successfully Updated');
};

const changePassword = async (req, res) => {
    const payload = req.body;
    const validate = await validator.isValidPayload(payload, commandModel.changePassword());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.changePassword(data);
    return sendResponse(result, res, 'Hooray, Password is Successfully Updated');
};

const listUser = async (req, res) => {
    const ctx = 'apiHandler-getUser';
    const { query } = req;
    const isValid = await validator.isValidPayload(query, queryModel.paginationSchema());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.listUser({ ...data });
    return paginationResponse(result, res, 'Hooray, This is List User you\'er asking for');
};

const getUser = async (req, res) => {
    const ctx = 'apiHandler-getUser';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, queryModel.getUser());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.getUser({ ...data });
    return paginationResponse(result, res, 'Hooray, This is User you\'er asking for');
};

const deleteUser = async (req, res) => {
    const ctx = 'apiHandler-deleteSymptom';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, commandModel.deleteUser());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await commandHandler.deleteUser({ ...data });
    return sendResponse(result, res, 'Hooray, Delete Symptom Success');
};

module.exports = {
    registerUser,
    login,
    updateUser,
    changePassword,
    listUser,
    getUser,
    deleteUser
};
