const InvalidRequestError = require('./invalid-request');

module.exports = class NoFileToUploadError extends InvalidRequestError {
  constructor() {
    super('No file to upload');
  }
};
