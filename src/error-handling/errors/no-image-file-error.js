const InvalidRequestError = require('./invalid-request');

module.exports = class NoImageFileError extends InvalidRequestError {
  constructor() {
    super('The uploaded file is not an image');
  }
};
