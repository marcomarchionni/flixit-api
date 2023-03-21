const NoGenreWithNameError = require('../error-handling/errors/no-genre-with-name-error');
const { Movies } = require('../models/models');

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
