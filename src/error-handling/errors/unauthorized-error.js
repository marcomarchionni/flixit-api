const CustomError = require('./custom-error');

module.exports = class UnauthorizedError extends CustomError {
  constructor(err) {
    const message = err && err.msg ? err.msg : 'Unauthorized';
    super(401, message);
  }
};
