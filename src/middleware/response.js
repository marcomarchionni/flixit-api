exports.sendMovies = (req, res) => {
  res.json(req.movies);
};

exports.sendMovie = (req, res) => {
  res.json(req.signedUrlMovie || req.movie);
};
