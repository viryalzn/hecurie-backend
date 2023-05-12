const wrapper = require('./wrapper');

const sendResponse = async (result, res, message, httpCode) => {
    return (result.err) ? wrapper.response(res, 'fail', result) :
        wrapper.response(res, 'success', result, message ? message : 'Your Request Has Been Processed', httpCode);
};

const sendResponseV2 = async (result, res, message) => {
    return (result.err) ? wrapper.responseV2(res, 'fail', result) :
        wrapper.responseV2(res, 'success', result, message ? message : 'Your Request Has Been Processed');
};

const paginationResponse = async (result, res, message) => {
    return (result.err) ? wrapper.response(res, 'fail', result) :
        wrapper.paginationResponse(res, 'success', result, message ? message : 'Your Request Has Been Processed');
};

module.exports = {
    sendResponse,
    sendResponseV2,
    paginationResponse
};
