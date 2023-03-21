const NotFoundError = require('./not-found-error');

module.exports = class NoUserWithUsernameError extends NotFoundError {
  constructor(username) {
    super('user', 'username', username);
  }
};
