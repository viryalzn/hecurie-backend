const commandHandler = require('../repositories/commands/command_handler');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const queryModel = require('../repositories/queries/query_model');
const validator = require('../../../helpers/utils/validator');
const { sendResponse, paginationResponse } = require('../../../helpers/utils/response');

/* Command */

const insertIllness = async (req, res) => {
    const ctx = 'apiHandler-insertIllness';
    const { body: payload } = req;
    const validate = await validator.isValidPayload(payload, commandModel.insertIllness());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.insertIllness({ ...data });
    return sendResponse(result, res, 'Hooray, The Illness is Successfully Inserted');
};

const updateIllness = async (req, res) => {
    const payload = req.body;
    const validate = await validator.isValidPayload(payload, commandModel.updateIllness());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.updateIllness(data);
    return sendResponse(result, res, 'Hooray, The Illness is Successfully Updated');
};

const getIllness = async (req, res) => {
    const ctx = 'apiHandler-getIllness';
    const { query } = req;
    const isValid = await validator.isValidPayload(query, queryModel.paginationSchema());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.getIllness({ ...data });
    return paginationResponse(result, res, 'Hooray, This is List Illness you\'er asking for');
};

const deleteIllness = async (req, res) => {
    const ctx = 'apiHandler-deleteIllness';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, commandModel.deleteIllness());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await commandHandler.deleteIllness({ ...data });
    return sendResponse(result, res, 'Hooray, Delete Illness Success');
};

module.exports = {
    insertIllness,
    updateIllness,
    getIllness,
    deleteIllness
};
