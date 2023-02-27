const { CustomError } = require('./custom-errors');

const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }
};

module.exports = {
  customErrorHandler,
};
