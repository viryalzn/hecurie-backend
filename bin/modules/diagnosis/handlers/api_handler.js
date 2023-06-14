const commandHandler = require('../repositories/commands/command_handler');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const queryModel = require('../repositories/queries/query_model');
const validator = require('../../../helpers/utils/validator');
const { sendResponse, paginationResponse } = require('../../../helpers/utils/response');

/* Command */

const insertDiagnosis = async (req, res) => {
    const ctx = 'apiHandler-insertDiagnosis';
    const { body: payload } = req;
    const validate = await validator.isValidPayload(payload, commandModel.insertDiagnosis());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.insertDiagnosis({ ...data });
    return sendResponse(result, res, 'Hooray, The Diagnosis is Successfully Inserted' + '\n' +
        'Your mood disorder diagnosis results are ' + result.data.diagnosis.illness[0].illnessName + ' with a confidence level of ' +
        result.data.diagnosis.confidence + '%.');
};

const updateDiagnosis = async (req, res) => {
    const payload = req.body;
    const validate = await validator.isValidPayload(payload, commandModel.updateDiagnosis());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.updateDiagnosis(data);
    return sendResponse(result, res, 'Hooray, The Diagnosis is Successfully Updated');
};

const listDiagnosis = async (req, res) => {
    const ctx = 'apiHandler-getDiagnosis';
    const { query } = req;
    const isValid = await validator.isValidPayload(query, queryModel.paginationSchema());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.listDiagnosis({ ...data });
    return paginationResponse(result, res, 'Hooray, This is List Diagnosis you\'er asking for');
};

const getDiagnosis = async (req, res) => {
    const ctx = 'apiHandler-getDiagnosis';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, queryModel.getDiagnosis());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.getDiagnosis({ ...data });
    return paginationResponse(result, res, 'Hooray, This is Diagnosis you\'er asking for');
};

const deleteDiagnosis = async (req, res) => {
    const ctx = 'apiHandler-deleteDiagnosis';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, commandModel.deleteDiagnosis());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await commandHandler.deleteDiagnosis({ ...data });
    return sendResponse(result, res, 'Hooray, Delete Diagnosis Success');
};

module.exports = {
    insertDiagnosis,
    updateDiagnosis,
    listDiagnosis,
    getDiagnosis,
    deleteDiagnosis
};
