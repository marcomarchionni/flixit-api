const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  Models = require('./models'),
  response = require('./responses.js'),
  userController = require('./controllers/user.js'),
  userValidation = require('./validation/user');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/flixdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// helper methods
function isEmpty(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return true;
  return false;
}

/* Middleware */
// Logging
app.use(morgan('common'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
const allowedOrigins = ['http://localhost:8080'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      // origin is allowed
      return callback(null, true);
    },
  })
);

require('./auth.js')(app);
require('./passport');

// Static Requests
app.use(express.static('public'));

// ROOT request
app.get('/', (req, res) => {
  res.redirect('/documentation.html');
});

// GET list of all movies
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => response.success(res, movies))
      .catch((err) => response.serverError(res, err));
  }
);

// GET a movie by title
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const title = req.params.title;
    Movies.findOne({ title: title })
      .then((movieFound) => {
        if (!movieFound) {
          response.noMovieWithTitle(res, title);
        } else {
          response.success(res, movieFound);
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// GET movies by director
app.get(
  '/movies/directors/:director',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const directorName = req.params.director;
    Movies.find({ 'director.name': directorName })
      .then((movies) => {
        if (isEmpty(movies)) {
          response.noMoviesWithDirector(res, directorName);
        } else {
          response.success(res, movies);
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// GET movies by genre
app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const genreName = req.params.genreName;
    Movies.find({ 'genre.name': genreName })
      .then((movies) => {
        if (isEmpty(movies)) {
          response.noMoviesWithGenre(res, genreName);
        } else {
          response.success(res, movies);
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// GET genre by name
app.get(
  '/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const genreName = req.params.genreName;
    Movies.findOne({ 'genre.name': genreName }, { genre: 1 })
      .then((result) => {
        console.log(result);
        if (result) {
          response.success(res, result.genre);
        } else {
          response.noGenreWithName(res, genreName);
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// GET director by name
app.get(
  '/directors/:directorName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);

// CREATE new user
app.post(
  '/users',
  userValidation.validateCreateUserData,
  userController.createUser
);

// UPDATE user info
app.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  userValidation.validateUpdateUserData,
  userController.updateUser
);

// ADD movie to user list of favourites
app.put(
  '/users/:username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  userController.addMovie
);

// DELETE movie from list of favourites
app.delete(
  '/users/:username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  userController.removeMovie
);

// DELETE user by username
app.delete(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  userController.deleteUser
);

// Error Handling
app.use((err, req, res, next) => {
  response.serverError(res, err);
});

// Listen for requests
app.listen(8080, () => {
  console.log('Movie App is listening on port 8080.');
});
