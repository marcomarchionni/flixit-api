const {
  noMovieWithTitleError,
  noMoviesWithDirectorError,
  noMoviesWithGenreError,
} = require('../errors/custom-errors');
const { Movies } = require('../models/models');
const { isEmptyArray } = require('../utils/utils');

// helper method

exports.findMovies = (req, res, next) => {
  Movies.find()
    .then((movies) => res.json(movies))
    .catch((err) => next(err));
};

exports.findMovieByTitle = (req, res, next) => {
  const title = req.params.title;
  Movies.findOne({ title: title })
    .then((movieFound) => {
      if (!movieFound) {
        throw new noMovieWithTitleError(title);
      } else {
        res.json(movieFound);
      }
    })
    .catch((err) => next(err));
};

exports.findMovieByDirector = (req, res, next) => {
  const directorName = req.params.director;
  Movies.find({ 'director.name': directorName })
    .then((movies) => {
      if (isEmptyArray(movies)) {
        throw new noMoviesWithDirectorError(directorName);
      } else {
        res.json(movies);
      }
    })
    .catch((err) => next(err));
};

exports.findMovieByGenre = (req, res, next) => {
  const genreName = req.params.genreName;
  Movies.find({ 'genre.name': genreName })
    .then((movies) => {
      if (isEmptyArray(movies)) {
        throw new noMoviesWithGenreError(genreName);
      } else {
        res.json(movies);
      }
    })
    .catch((err) => next(err));
};
