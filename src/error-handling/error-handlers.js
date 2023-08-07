/**
 * @file Contains middleware functions for error handling.
 * @version 1.0.0
 */

const CustomError = require('./errors/custom-error');
const S3Error = require('./errors/s3-error');

/**
 * Logs the error to the console and passes it to the next middleware.
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const errorLogger = (err, req, res, next) => {
  console.error('\x1b[31m', err);
  next(err);
};

/**
 * Handles custom errors by sending an appropriate JSON response.
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
// eslint-disable-next-line no-unused-vars
const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else if (err instanceof S3Error) {
    res.status(err.statusCode).json(err);
  } else {
    res.status(500).json({
      status: 500,
      message: `Server Error: ${err.message}`,
    });
  }
};

/**
 * Handles invalid paths by sending a JSON response with a 404 status code.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
// eslint-disable-next-line no-unused-vars
const invalidPathHandler = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: `Invalid path`,
  });
};

module.exports = {
  errorLogger,
  customErrorHandler,
  invalidPathHandler,
};
