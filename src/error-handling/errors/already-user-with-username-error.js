const CustomError = require('./custom-error');

module.exports = class AlreadyUserWithUsernameError extends CustomError {
  constructor(username) {
    const message = `There is already a user with username ${username}`;
    super(400, message);
  }
};
