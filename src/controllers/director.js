/**
 * @file Defines controller functions for finding movie directors.
 * @version 1.0.0
 */

const NoDirectorWithNameError = require('../error-handling/errors/no-director-with-name-error');
const { Movies } = require('../models/models');

/**
 * Finds a director by name in the Movies collection.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @throws {NoDirectorWithNameError} Throws a custom error if no director with the specified name is found.
 */
exports.findDirectorByName = (req, res, next) => {
  const { directorName } = req.params;
  Movies.findOne({ 'director.name': directorName })
    .then((result) => {
      if (!result) {
        throw new NoDirectorWithNameError(directorName);
      } else {
        res.json(result.director);
      }
    })
    .catch(next);
};
