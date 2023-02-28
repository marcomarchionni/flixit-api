const { NoDirectorWithNameError } = require('../errors/custom-errors');
const { Movies } = require('../models/models');

exports.findDirectorByName = (req, res, next) => {
  const directorName = req.params.directorName;
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
