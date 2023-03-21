const NoDirectorWithNameError = require('../error-handling/errors/no-director-with-name-error');
const { Movies } = require('../models/models');

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
