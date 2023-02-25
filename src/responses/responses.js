// responses
function notFoundResponse(res, entityName, fieldName, fieldValue) {
  res.status(404).json({
    status: 404,
    message: `${entityName} with ${fieldName} ${fieldValue} not found`,
  });
}

exports.success = (res, obj) => {
  res.json(obj);
};

exports.created = (res, obj) => {
  res.status(201).json(obj);
};

exports.noMovieWithMovieId = (res, movieId) => {
  return notFoundResponse(res, 'Movie', 'movieId', movieId);
};

exports.noMovieWithTitle = (res, title) => {
  return notFoundResponse(res, 'Movie', 'title', title);
};

exports.noMoviesWithDirector = (res, directorName) => {
  return notFoundResponse(res, 'Movies', 'director', directorName);
};

exports.noMoviesWithGenre = (res, genreName) => {
  return notFoundResponse(res, 'Movies', 'genre', genreName);
};

exports.noUserWithUsername = (res, username) => {
  return notFoundResponse(res, 'User', 'username', username);
};

exports.noGenreWithName = (res, genreName) => {
  return notFoundResponse(res, 'Genre', 'name', genreName);
};

exports.noDirectorWithName = (res, directorName) => {
  return notFoundResponse(res, 'Director', 'name', directorName);
};

exports.alreadyUserWithEmail = (res, email) => {
  return res.status(400).json({
    status: 400,
    message: `There is already a user with email ${email}`,
  });
};

exports.alreadyUserWithUsername = (res, username) => {
  return res.status(400).json({
    status: 400,
    message: `There is already a user with username ${username}`,
  });
};

exports.invalidData = (res) => {
  res.status(400).json({ status: 400, message: `Invalid request data` });
};

exports.validationErrors = (res, errors) => {
  res.status(422).json({ status: 422, message: errors.array() });
};

exports.serverError = (res, err) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ status: 500, message: 'Server error', error: err.stack });
};
