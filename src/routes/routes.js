const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js'),
  movieController = require('../controllers/movie'),
  genreController = require('../controllers/genre'),
  directorController = require('../controllers/director'),
  userValidation = require('../validation/user'),
  auth = require('../authentication/auth.js');

// ROOT
router.get('/', (req, res) => {
  res.redirect('/documentation.html');
});

// LOGIN user
router.post('/login', auth.localAuthentication);

// GET list of all movies
router.get('/movies', auth.JWTAutentication, movieController.findMovies);

// GET movies by title
router.get(
  '/movies/:title',
  auth.JWTAutentication,
  movieController.findMovieByTitle
);

// GET movies by director
router.get(
  '/movies/directors/:director',
  auth.JWTAutentication,
  movieController.findMovieByDirector
);

// GET movies by genre
router.get(
  '/movies/genres/:genreName',
  auth.JWTAutentication,
  movieController.findMovieByGenre
);

// GET genre by name
router.get(
  '/genres/:genreName',
  auth.JWTAutentication,
  genreController.findGenreByName
);

// GET director by name
router.get(
  '/directors/:directorName',
  auth.JWTAutentication,
  directorController.findDirectorByName
);

// CREATE new user
router.post(
  '/users',
  userValidation.validateCreateUserData,
  userController.createUser
);

// UPDATE user
router.put(
  '/users/:username',
  auth.JWTAutentication,
  userValidation.validateUpdateUserData,
  userController.updateUser
);

// ADD movie to user list of favourites
router.put(
  '/users/:username/movies/:movieId',
  auth.JWTAutentication,
  userController.addMovie
);

// DELETE movie from list of favourites
router.delete(
  '/users/:username/movies/:movieId',
  auth.JWTAutentication,
  userController.removeMovie
);

// DELETE user by username
router.delete(
  '/users/:username',
  auth.JWTAutentication,
  userController.deleteUser
);

module.exports = router;
