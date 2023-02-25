const { Movies } = require('../models/models');
const response = require('../responses/responses');

// helper methods
function isEmpty(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return true;
  return false;
}

exports.findMovies = (req, res) => {
  Movies.find()
    .then((movies) => response.success(res, movies))
    .catch((err) => response.serverError(res, err));
};

exports.findMovieByTitle = (req, res) => {
  const title = req.params.title;
  Movies.findOne({ title: title })
    .then((movieFound) => {
      if (!movieFound) {
        response.noMovieWithTitle(res, title);
      } else {
        response.success(res, movieFound);
      }
    })
    .catch((err) => response.serverError(res, err));
};

exports.findMovieByDirector = (req, res) => {
  const directorName = req.params.director;
  Movies.find({ 'director.name': directorName })
    .then((movies) => {
      if (isEmpty(movies)) {
        response.noMoviesWithDirector(res, directorName);
      } else {
        response.success(res, movies);
      }
    })
    .catch((err) => response.serverError(res, err));
};

exports.findMovieByGenre = (req, res) => {
  const genreName = req.params.genreName;
  Movies.find({ 'genre.name': genreName })
    .then((movies) => {
      if (isEmpty(movies)) {
        response.noMoviesWithGenre(res, genreName);
      } else {
        response.success(res, movies);
      }
    })
    .catch((err) => response.serverError(res, err));
};
