const NotFoundError = require('./not-found-error');

module.exports = class NoDirectorWithNameError extends NotFoundError {
  constructor(directorName) {
    super('director', 'name', directorName);
  }
};
