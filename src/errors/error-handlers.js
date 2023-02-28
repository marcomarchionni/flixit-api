const { CustomError } = require('./custom-errors');

const errorLogger = (err, req, res, next) => {
  console.error('\x1b[31m', err);
  next(err);
};

const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: `Server Error: ${err.message}`,
    });
  }
};

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
