const { Movies } = require('../models/models');
const response = require('../responses/responses');

exports.findGenreByName = (req, res) => {
  const genreName = req.params.genreName;
  Movies.findOne({ 'genre.name': genreName }, { genre: 1 })
    .then((result) => {
      if (result) {
        response.success(res, result.genre);
      } else {
        response.noGenreWithName(res, genreName);
      }
    })
    .catch((err) => response.serverError(res, err));
};
