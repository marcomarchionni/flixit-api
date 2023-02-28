class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

class NotFoundError extends CustomError {
  constructor(entityName, fieldName, fieldValue) {
    const message = `No ${entityName} with ${fieldName} ${fieldValue} was found`;
    super(404, message);
  }
}

class NoUserWithUsernameError extends NotFoundError {
  constructor(username) {
    super('user', 'username', username);
  }
}

class NoMovieWithIdError extends NotFoundError {
  constructor(movieId) {
    super('movie', 'id', movieId);
  }
}

class NoMovieWithTitleError extends NotFoundError {
  constructor(title) {
    super('movie', 'title', title);
  }
}

class NoMoviesWithDirectorError extends NotFoundError {
  constructor(directorName) {
    super('movie', 'director', directorName);
  }
}

class NoMoviesWithGenreError extends NotFoundError {
  constructor(genreName) {
    super('movie', 'genre', genreName);
  }
}

class NoGenreWithNameError extends NotFoundError {
  constructor(genreName) {
    super('genre', 'name', genreName);
  }
}

class NoDirectorWithNameError extends NotFoundError {
  constructor(directorName) {
    super('director', 'name', directorName);
  }
}

class AlreadyUserWithUsernameError extends CustomError {
  constructor(username) {
    const message = `There is already a user with username ${username}`;
    super(400, message);
  }
}

class AlreadyUserWithEmailError extends CustomError {
  constructor(email) {
    const message = `There is already a user with email ${email}`;
    super(400, message);
  }
}

class InvalidCredentialsError extends CustomError {
  constructor() {
    super(401, 'Invalid credentials, login failed');
  }
}

class ValidationErrors extends CustomError {
  constructor(errors) {
    const message =
      errors
        .array()
        .map((e) => `${e.msg}`)
        .join('. ') + '.';
    super(422, message);
  }
}

class CORSError extends CustomError {
  constructor(origin) {
    const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
    super(400, message);
  }
}

class ServerError extends CustomError {
  constructor(error) {
    const message = error.msg || 'Server error';
    super(500, message);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  NoUserWithUsernameError,
  NoMovieWithIdError,
  NoMovieWithTitleError,
  NoMoviesWithDirectorError,
  NoMoviesWithGenreError,
  NoGenreWithNameError,
  NoDirectorWithNameError,
  AlreadyUserWithUsernameError,
  AlreadyUserWithEmailError,
  ValidationErrors,
  InvalidCredentialsError,
  CORSError,
  ServerError,
};
