const CustomError = require('./custom-error');

module.exports = class NotFoundError extends CustomError {
  constructor(entityName, fieldName, fieldValue) {
    const message = `No ${entityName} with ${fieldName} ${fieldValue} was found`;
    super(404, message);
  }
};
