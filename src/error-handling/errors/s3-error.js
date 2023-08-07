module.exports = class S3Error extends Error {
  constructor(error) {
    super();
    this.statusCode = error.$metadata.httpStatusCode;
    this.message = error.Code;
    this.details = error;
  }
};
