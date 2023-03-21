const CustomError = require('./custom-error');

module.exports = class InvalidCredentialsError extends CustomError {
  constructor() {
    super(401, 'Invalid credentials, login failed');
  }
};
