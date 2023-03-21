const NotFoundError = require('./not-found-error');

module.exports = class NoGenreWithNameError extends NotFoundError {
  constructor(genreName) {
    super('genre', 'name', genreName);
  }
};
