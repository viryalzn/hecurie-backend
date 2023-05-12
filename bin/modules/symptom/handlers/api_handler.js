const commandHandler = require('../repositories/commands/command_handler');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const queryModel = require('../repositories/queries/query_model');
const validator = require('../../../helpers/utils/validator');
const { sendResponse, paginationResponse } = require('../../../helpers/utils/response');

/* Command */

const insertSymptom = async (req, res) => {
    const ctx = 'apiHandler-insertSymptom';
    const { body: payload } = req;
    const validate = await validator.isValidPayload(payload, commandModel.insertSymptom());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.insertSymptom({ ...data });
    return sendResponse(result, res, 'Hooray, The Symptom is Successfully Inserted');
};

const updateSymptom = async (req, res) => {
    const payload = req.body;
    const validate = await validator.isValidPayload(payload, commandModel.updateSymptom());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.updateSymptom(data);
    return sendResponse(result, res, 'Hooray, The Symptom is Successfully Updated');
};

const listSymptom = async (req, res) => {
    const ctx = 'apiHandler-getSymptom';
    const { query } = req;
    const isValid = await validator.isValidPayload(query, queryModel.paginationSchema());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.listSymptom({ ...data });
    return paginationResponse(result, res, 'Hooray, This is List Symptom you\'er asking for');
};

const getSymptom = async (req, res) => {
    const ctx = 'apiHandler-getSymptom';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, queryModel.getSymptom());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.getSymptom({ ...data });
    return paginationResponse(result, res, 'Hooray, This is Symptom you\'er asking for');
};

const deleteSymptom = async (req, res) => {
    const ctx = 'apiHandler-deleteSymptom';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, commandModel.deleteSymptom());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await commandHandler.deleteSymptom({ ...data });
    return sendResponse(result, res, 'Hooray, Delete Symptom Success');
};

module.exports = {
    insertSymptom,
    updateSymptom,
    listSymptom,
    getSymptom,
    deleteSymptom
};
