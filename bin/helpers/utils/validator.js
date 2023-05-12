
const wrapper = require('./wrapper');
const { BadRequestError } = require('../error');

const isValidPayload = (payload, constraint) => {
    const { value, error } = constraint.validate(payload);
    if (error) {
        const message = error.details[0].message.replace(/"/g, '');
        return wrapper.error(new BadRequestError(message));
    }
    return wrapper.data(value, 'success', 200);

};

const isValidMultiplePayload = (payload, constraint) => {
    const { value, error } = constraint.validate(payload, {
        abortEarly: false
    });
    if (error) {
        const errorMultiple = error.details.map(e => e.message.replace(/"/g, '/'));
        return wrapper.error(new BadRequestError(errorMultiple));
    }
    return wrapper.data(value, 'success', 200);
};


module.exports = {
    isValidPayload,
    isValidMultiplePayload
};
