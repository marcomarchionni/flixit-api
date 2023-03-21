const CustomError = require('./custom-error');

module.exports = class CORSError extends CustomError {
  constructor(origin) {
    const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
    super(400, message);
  }
};
