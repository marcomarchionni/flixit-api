const NotFoundError = require('./not-found-error');

module.exports = class NoMoviesWithDirectorError extends NotFoundError {
  constructor(directorName) {
    super('movie', 'director', directorName);
  }
};
