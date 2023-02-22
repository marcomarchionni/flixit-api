const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  response = require('./responses.js');

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

// validation
function userIsValid(user) {
  return user && user.username && user.email && user.password;
}

function userUpdateIsValid(update) {
  const atLeastOneFieldNotNull =
    update.username || update.email || update.password || update.birthday;
  const validFields = Object.keys(update).every((key) =>
    ['username', 'email', 'password', 'birthday'].includes(key)
  );
  return update && atLeastOneFieldNotNull && validFields;
}

// init middleware
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require('./auth.js')(app);
const passport = require('passport');
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
app.post('/users', (req, res) => {
  const user = req.body;
  console.log(user);
  if (!userIsValid(user)) {
    console.log('invalid user');
    response.invalidData(res);
  } else {
    // check if username and email are already taken
    Users.findOne({
      $or: [{ email: user.email }, { username: user.username }],
    })
      .then((result) => {
        if (result && result.email === user.email) {
          return response.alreadyUserWithEmail(res, user.email);
        }
        if (result && result.email === user.username) {
          return response.alreadyUserWithUsername(res, user.username);
        }
        // username and email not in db, so create new user
        return Users.create({
          username: user.username,
          email: user.email,
          password: user.password,
          birthday: user.birthday,
        }).then((createdUser) => response.created(res, createdUser));
      })
      .catch((err) => response.serverError(res, err));
  }
});

// UPDATE user info
app.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // validate request data
    const userUpdate = req.body;
    if (!userUpdateIsValid(userUpdate)) {
      return response.invalidData(res, userUpdate);
    }
    // valid data, update db
    Users.findOneAndUpdate(
      { username: req.params.username },
      { $set: userUpdate },
      { new: true }
    )
      .then((userUpdated) => {
        if (!userUpdated) {
          return response.noUserWithUsername(req.params.username);
        } else {
          return response.success(res, userUpdated);
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// ADD movie to user list of favourites
app.put(
  '/users/:username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const username = req.params.username;
    const movieId = req.params.movieId;
    // check if movieId is valid
    Movies.findById(movieId)
      .then((movieFound) => {
        if (!movieFound) {
          return response.noMovieWithMovieId(res, movieId);
        } else {
          // update user with movieId
          return Users.findOneAndUpdate(
            { username: username },
            { $addToSet: { favouriteMovies: movieId } },
            { new: true }
          ).then((updatedUser) => {
            if (!updatedUser) {
              response.noUserWithUsername(res, username);
            } else {
              response.success(res, updatedUser);
            }
          });
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// DELETE movie from list of favourites
app.delete(
  '/users/:username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const username = req.params.username;
    const movieId = req.params.movieId;
    //check if movieId is valid
    Movies.findById(movieId)
      .then((movieFound) => {
        if (!movieFound) {
          return response.noMovieWithMovieId(res, movieId);
        } else {
          return Users.findOneAndUpdate(
            { username: username },
            { $pull: { favouriteMovies: movieId } },
            { new: true }
          ).then((updatedUser) => {
            if (!updatedUser) {
              response.noUserWithUsername(res, username);
            } else {
              response.success(res, updatedUser);
            }
          });
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// DELETE user by username
app.delete(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const username = req.params.username;
    Users.findOneAndDelete({ username: username })
      .then((deletedUser) => {
        if (!deletedUser) {
          return response.noUserWithUsername(res, username);
        } else {
          return response.success(res, deletedUser);
        }
      })
      .catch((err) => response.serverError(res, err));
  }
);

// Error Handling
app.use((err, req, res, next) => {
  response.serverError(res, err);
});

// Listen for requests
app.listen(8080, () => {
  console.log('Movie App is listening on port 8080.');
});
