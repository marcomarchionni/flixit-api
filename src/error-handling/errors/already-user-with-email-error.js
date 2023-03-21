const CustomError = require('./custom-error');

module.exports = class AlreadyUserWithEmailError extends CustomError {
  constructor(email) {
    const message = `There is already a user with email ${email}`;
    super(400, message);
  }
};
