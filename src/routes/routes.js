/**
 * @file Defines the router for handling movie, user, genre, and director related routes.
 * @version 1.0.0
 */

const express = require('express');
const userController = require('../controllers/user');
const movieController = require('../controllers/movie');
const genreController = require('../controllers/genre');
const directorController = require('../controllers/director');
const imagesController = require('../controllers/images');
const validation = require('../middleware/validation');
const authentication = require('../middleware/authentication');

const router = express.Router();

// Static
router.use(express.static('src/public'));

// ROOT
router.get('/', (req, res) => {
  res.redirect('/documentation.html');
});

// LOGIN user
router.post('/login', authentication.localAuth);

// GET list of all movies
router.get('/movies', authentication.JWTAuth, movieController.findMovies);

// GET movies by title
router.get(
  '/movies/:title',
  authentication.JWTAuth,
  movieController.findMovieByTitle
);

// GET movies by director
router.get(
  '/movies/directors/:director',
  authentication.JWTAuth,
  movieController.findMovieByDirector
);

// GET movies by genre
router.get(
  '/movies/genres/:genreName',
  authentication.JWTAuth,
  movieController.findMovieByGenre
);

// GET genre by name
router.get(
  '/genres/:genreName',
  authentication.JWTAuth,
  genreController.findGenreByName
);

// GET director by name
router.get(
  '/directors/:directorName',
  authentication.JWTAuth,
  directorController.findDirectorByName
);

// CREATE new user
router.post(
  '/users',
  validation.createUserRules,
  validation.handleResults,
  userController.createUser
);

// UPDATE user
router.put(
  '/users/:username',
  authentication.JWTAuth,
  validation.updateUserRules,
  validation.handleResults,
  userController.updateUser
);

// ADD movie to user list of favourites
router.put(
  '/users/:username/movies/:movieId',
  authentication.JWTAuth,
  userController.addMovie
);

// DELETE movie from list of favourites
router.delete(
  '/users/:username/movies/:movieId',
  authentication.JWTAuth,
  userController.removeMovie
);

// DELETE user by username
router.delete(
  '/users/:username',
  authentication.JWTAuth,
  userController.deleteUser
);

// LIST images from S3 bucket
router.get('/images', imagesController.listImages);

// UPLOAD image to S3 bucket
router.post('/images', imagesController.uploadImage);

// RETRIEVE image from S3 bucket
router.get('/images/:fileName', imagesController.retrieveImage);

module.exports = router;
