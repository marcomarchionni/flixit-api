/**
 * @file Defines controller functions for finding movie genres.
 * @version 1.0.0
 */

const NoGenreWithNameError = require('../error-handling/errors/no-genre-with-name-error');
const { Movies } = require('../models/models');

/**
 * Finds a genre by name and returns the genre object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @throws {NoGenreWithNameError} Throws a custom error if no genre with the specified name is found
 */
exports.findGenreByName = (req, res, next) => {
  const { genreName } = req.params;
  Movies.findOne({ 'genre.name': genreName }, { genre: 1 })
    .then((result) => {
      if (!result) {
        throw new NoGenreWithNameError(genreName);
      } else {
        res.json(result.genre);
      }
    })
    .catch((err) => next(err));
};
