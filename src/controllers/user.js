const { Users, Movies } = require('../models/models');
const {
  AlreadyUserWithUsernameError,
  AlreadyUserWithEmailError,
  NoUserWithUsernameError,
  NoMovieWithIdError,
} = require('../errors/custom-errors');

exports.createUser = async (req, res, next) => {
  try {
    const createUserObject = {};
    const { username, password, email, birthday } = req.body;

    // check if username is already in db
    const userWithUsername = await Users.findOne({ username });
    if (userWithUsername) {
      throw new AlreadyUserWithUsernameError(username);
    } else {
      createUserObject.username = username;
    }

    // check if email is already in db
    const userWithEmail = await Users.findOne({ email });
    if (userWithEmail) {
      throw new AlreadyUserWithEmailError(email);
    } else {
      createUserObject.email = email;
    }

    // hash password
    createUserObject.password = Users.hashPassword(password);

    // add birthday
    if (birthday) {
      createUserObject.birthday = birthday;
    }

    // username and email not in db, so create new user
    const createdUser = await Users.create(createUserObject);
    res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updateUserObject = {};
    const { username, password, email, birthday } = req.body;

    if (username) {
      // check if username exists in db
      const user = await Users.findOne({ username });
      if (user) {
        throw new AlreadyUserWithUsernameError(username);
      } else {
        updateUserObject.username = username;
      }
    }
    if (email) {
      // check if email exists in db
      const user = await Users.findOne({ email });
      if (user) {
        throw new AlreadyUserWithEmailError(email);
      } else {
        updateUserObject.email = email;
      }
    }
    if (password) {
      // hash password
      updateUserObject.password = Users.hashPassword(password);
    }
    if (birthday) {
      updateUserObject.birthday = birthday;
    }

    // update user
    const updatedUser = await Users.findOneAndUpdate(
      { username: req.params.username },
      { $set: updateUserObject },
      { new: true }
    );
    if (!updatedUser) {
      throw new NoUserWithUsernameError(req.params.username);
    } else {
      res.json(updatedUser);
    }
  } catch (err) {
    next(err);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const username = req.params.username;
    const movieId = req.params.movieId;

    // check if movieId is valid
    const movieFound = await Movies.findById(movieId);
    if (!movieFound) {
      throw new NoMovieWithIdError(movieId);
    } else {
      // update user with movieId
      const updatedUser = await Users.findOneAndUpdate(
        { username: username },
        { $addToSet: { favouriteMovies: movieId } },
        { new: true }
      );
      if (!updatedUser) {
        throw new NoUserWithUsernameError(username);
      } else {
        res.json(updatedUser);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.removeMovie = async (req, res, next) => {
  try {
    const username = req.params.username;
    const movieId = req.params.movieId;

    //check if movieId exists
    const movieFound = await Movies.findById(movieId);
    if (!movieFound) {
      throw new NoMovieWithIdError(movieId);
    } else {
      const updatedUser = await Users.findOneAndUpdate(
        { username: username },
        { $pull: { favouriteMovies: movieId } },
        { new: true }
      );
      if (!updatedUser) {
        throw new NoUserWithUsernameError(username);
      } else {
        return res.json(updatedUser);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const username = req.params.username;
    const deletedUser = await Users.findOneAndDelete({ username: username });
    if (!deletedUser) {
      throw new NoUserWithUsernameError(username);
    } else {
      res.json(deletedUser);
    }
  } catch (err) {
    next(err);
  }
};
