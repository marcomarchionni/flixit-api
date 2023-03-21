const NotFoundError = require('./not-found-error');

module.exports = class NoMoviesWithGenreError extends NotFoundError {
  constructor(genreName) {
    super('movie', 'genre', genreName);
  }
};
