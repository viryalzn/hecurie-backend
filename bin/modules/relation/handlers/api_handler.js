const commandHandler = require('../repositories/commands/command_handler');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const queryModel = require('../repositories/queries/query_model');
const validator = require('../../../helpers/utils/validator');
const { sendResponse, paginationResponse } = require('../../../helpers/utils/response');

/* Command */

const insertRelation = async (req, res) => {
    const ctx = 'apiHandler-insertRelation';
    const { body: payload } = req;
    const validate = await validator.isValidPayload(payload, commandModel.insertRelation());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.insertRelation({ ...data });
    return sendResponse(result, res, 'Hooray, The Relation is Successfully Inserted');
};

const updateRelation = async (req, res) => {
    const payload = req.body;
    const validate = await validator.isValidPayload(payload, commandModel.updateRelation());
    if (validate.err) {
        return sendResponse(validate, res);
    }
    const { data } = validate;
    const result = await commandHandler.updateRelation(data);
    return sendResponse(result, res, 'Hooray, The Relation is Successfully Updated');
};

const listRelation = async (req, res) => {
    const ctx = 'apiHandler-getRelation';
    const { query } = req;
    const isValid = await validator.isValidPayload(query, queryModel.paginationSchema());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.listRelation({ ...data });
    return paginationResponse(result, res, 'Hooray, This is List Relation you\'er asking for');
};

const getRelation = async (req, res) => {
    const ctx = 'apiHandler-getRelation';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, queryModel.getRelation());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await queryHandler.getRelation({ ...data });
    return paginationResponse(result, res, 'Hooray, This is Relation you\'er asking for');
};

const deleteRelation = async (req, res) => {
    const ctx = 'apiHandler-deleteRelation';
    const payload = req.params;
    const isValid = await validator.isValidPayload(payload, commandModel.deleteRelation());
    if (isValid.err) {
        return sendResponse(isValid, res);
    }
    const { data } = isValid;
    const result = await commandHandler.deleteRelation({ ...data });
    return sendResponse(result, res, 'Hooray, Delete Relation Success');
};

module.exports = {
    insertRelation,
    updateRelation,
    listRelation,
    getRelation,
    deleteRelation
};
