const CustomError = require('./custom-error');

module.exports = class ValidationErrors extends CustomError {
  constructor(errors) {
    const message = `${errors
      .array()
      .map((e) => `${e.msg}`)
      .join('. ')}.`;
    super(422, message);
  }
};
