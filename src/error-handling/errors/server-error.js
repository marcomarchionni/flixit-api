const CustomError = require('./custom-error');

module.exports = class ServerError extends CustomError {
  constructor(error) {
    const message = error.msg || 'Server error';
    super(500, message);
  }
};
