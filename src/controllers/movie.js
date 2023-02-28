const {
  NoMovieWithTitleError,
  NoMoviesWithDirectorError,
  NoMoviesWithGenreError,
} = require('../errors/custom-errors');
const { Movies } = require('../models/models');
const { isEmptyArray } = require('../utils/utils');

// helper method

exports.findMovies = (req, res, next) => {
  Movies.find()
    .then((movies) => res.json(movies))
    .catch(next);
};

exports.findMovieByTitle = (req, res, next) => {
  const title = req.params.title;
  Movies.findOne({ title: title })
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
  const genreName = req.params.genreName;
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
