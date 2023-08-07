const InvalidRequestError = require('./invalid-request');

module.exports = class NoFilenameError extends InvalidRequestError {
  constructor() {
    super('No filename in request');
  }
};
