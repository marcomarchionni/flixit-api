const CustomError = require('./custom-error');

module.exports = class InvalidRequestError extends CustomError {
  constructor(message) {
    super(400, message || 'Bad request');
  }
};
