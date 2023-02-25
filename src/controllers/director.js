const { Movies } = require('../models/models');
const response = require('../responses/responses.js');

exports.findDirectorByName = (req, res) => {
  const directorName = req.params.directorName;
  Movies.findOne({ 'director.name': directorName })
    .then((result) => {
      if (result) {
        response.success(res, result.director);
      } else {
        response.noDirectorWithName(res, directorName);
      }
    })
    .catch((err) => response.serverError(res, err));
};
