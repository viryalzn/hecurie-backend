
const { NotFoundError, InternalServerError, BadRequestError, ConflictError, ExpectationFailedError,
    ForbiddenError, GatewayTimeoutError, ServiceUnavailableError, UnauthorizedError, NotAcceptableError } = require('../error');
const { ERROR:httpError } = require('../http-status/status_code');

const data = (data) => ({ err: null, data});

const paginationData = (data, meta) => ({ err: null, data, meta});

const error = (err, statusCode) => ({ err, data: null, statusCode: statusCode || '0000' });

const response = (res, type, result, message = '', responseCode = 200) => {
    let status = true;
    let data = result.data;
    let code = responseCode;
    let statusCode = '2000';
    if(type === 'fail'){
        const errCode = checkErrorCode(result.err);
        status = false;
        data = '';
        message = result.err.message || message;
        code = result.err.code || errCode ;
        statusCode = result.statusCode;
        responseCode = errCode;
    }
    res.send(responseCode,
        {
            success: status,
            data,
            message,
            code,
            statusCode
        });
};

const responseV2 = (res, type, result, message = '', code = 200) => {
    let status = true;
    let data = result.data;
    let statusCode = '2000';
    if(type === 'fail'){
        const isCustomError = typeof result.err && result.err.custom;
        status = false;
        data = '';
        statusCode = result.statusCode;
        if (isCustomError) {
            const { key, value } = result.err;
            message = { key, value };
            code = checkErrorCode(result.err.code);
        } else {
            message = result.err.message || message;
            code = checkErrorCode(result.err);
        }
    }
    res.send(code,
        {
            success: status,
            data,
            message,
            code,
            statusCode
        });
};

const paginationResponse = (res, type, result, message = '', code = 200) => {
    let status = true;
    let data = result.data;
    if(type === 'fail'){
        status = false;
        data = '';
        message = result.err;
    }
    res.send(code,
        {
            success: status,
            data,
            meta: result.meta,
            code,
            message
        }
    );
};

const checkErrorCode = (error) => {

    switch (error.constructor) {
        case BadRequestError:
            return httpError.BAD_REQUEST;
        case ConflictError:
            return httpError.CONFLICT;
        case ExpectationFailedError:
            return httpError.EXPECTATION_FAILED;
        case ForbiddenError:
            return httpError.FORBIDDEN;
        case GatewayTimeoutError:
            return httpError.GATEWAY_TIMEOUT;
        case InternalServerError:
            return httpError.INTERNAL_ERROR;
        case NotFoundError:
            return httpError.NOT_FOUND;
        case ServiceUnavailableError:
            return httpError.SERVICE_UNAVAILABLE;
        case UnauthorizedError:
            return httpError.UNAUTHORIZED;
        case NotAcceptableError:
            return httpError.NOT_ACCEPTABLE;
        default:
            return httpError.CONFLICT;
    }

};

module.exports = {
    data,
    paginationData,
    error,
    response,
    responseV2,
    paginationResponse
};
