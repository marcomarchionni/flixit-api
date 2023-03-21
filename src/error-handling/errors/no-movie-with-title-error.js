const NotFoundError = require('./not-found-error');

module.exports = class NoMovieWithTitleError extends NotFoundError {
  constructor(title) {
    super('movie', 'title', title);
  }
};
