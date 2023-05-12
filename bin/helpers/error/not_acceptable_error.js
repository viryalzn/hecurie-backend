
const CommonError = require('./common_error');

class NotAcceptable extends CommonError {
  constructor(message) {
    super(message || 'Not Found');
  }
}

module.exports = NotAcceptable;
