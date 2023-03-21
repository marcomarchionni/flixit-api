const NoMoviesWithDirectorError = require('../error-handling/errors/no-movie-with-director-error');
const NoMoviesWithGenreError = require('../error-handling/errors/no-movie-with-genre-error');
const NoMovieWithTitleError = require('../error-handling/errors/no-movie-with-title-error');
const { Movies } = require('../models/models');
const isEmptyArray = require('../utils/utils');

exports.findMovies = (req, res, next) => {
  Movies.find()
    .then((movies) => res.json(movies))
    .catch(next);
};

exports.findMovieByTitle = (req, res, next) => {
  const { title } = req.params;
  Movies.findOne({ title })
    .then((movieFound) => {
      if (!movieFound) {
        throw new NoMovieWithTitleError(title);
      } else {
        res.json(movieFound);
      }
    })
    .catch(next);
};

exports.findMovieByDirector = (req, res, next) => {
  const directorName = req.params.director;
  Movies.find({ 'director.name': directorName })
    .then((movies) => {
      if (isEmptyArray(movies)) {
        throw new NoMoviesWithDirectorError(directorName);
      } else {
        res.json(movies);
      }
    })
    .catch(next);
};

exports.findMovieByGenre = (req, res, next) => {
  const { genreName } = req.params;
  Movies.find({ 'genre.name': genreName })
    .then((movies) => {
      if (isEmptyArray(movies)) {
        throw new NoMoviesWithGenreError(genreName);
      } else {
        res.json(movies);
      }
    })
    .catch(next);
};
