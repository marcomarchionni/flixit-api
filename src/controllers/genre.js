const { NoGenreWithNameError } = require('../errors/custom-errors');
const { Movies } = require('../models/models');

exports.findGenreByName = (req, res, next) => {
  const genreName = req.params.genreName;
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
