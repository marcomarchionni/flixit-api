const NotFoundError = require('./not-found-error');

module.exports = class NoMovieWithIdError extends NotFoundError {
  constructor(movieId) {
    super('movie', 'id', movieId);
  }
};
