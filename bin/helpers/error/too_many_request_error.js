const CommonError = require('./common_error');

class TooManyRequestError extends CommonError {
  constructor(message) {
    super(message || 'Too Many Request');
  }
}

module.exports = TooManyRequestError;
