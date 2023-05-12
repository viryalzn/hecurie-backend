
const CommonError = require('./common_error');

class ForbiddenError extends CommonError {
  constructor(param = 'Forbidden') {
    super(param || 'Forbidden');
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = ForbiddenError;
