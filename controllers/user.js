const { matchedData } = require('express-validator');
const { User: Users, Movie: Movies } = require('../models');
const response = require('../responses');
const userValidation = require('../validation/user');

exports.createUser = async (req, res) => {
  // handle validation errors
  userValidation.handleValidation(req);

  const createUserObject = {};
  const { username, password, email, birthday } = matchedData(req, {
    includeOptional: false,
  });

  // check if username is already in db
  const userWithUsername = await Users.findOne({ username });
  if (userWithUsername) {
    return response.alreadyUserWithUsername(res, username);
  } else {
    createUserObject.username = username;
  }

  // check if email is already in db
  const userWithEmail = await Users.findOne({ email });
  if (userWithEmail) {
    return response.alreadyUserWithEmail(res, email);
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
  return response.created(res, createdUser);
};

exports.updateUser = async (req, res) => {
  // handle validation errors
  userValidation.handleValidation(req);

  const updateUserObject = {};
  const { username, password, email, birthday } = matchedData(req, {
    includeOptional: false,
  });

  if (username) {
    // check if username exists in db
    const user = await Users.findOne({ username });
    if (user) {
      return response.alreadyUserWithUsername(res, username);
    } else {
      updateUserObject.username = username;
    }
  }
  if (email) {
    // check if email exists in db
    const user = await Users.findOne({ email });
    if (user) {
      return response.alreadyUserWithEmail(res, email);
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
    return response.noUserWithUsername(res, req.params.username);
  } else {
    return response.success(res, updatedUser);
  }
};

exports.addMovie = async (req, res) => {
  const username = req.params.username;
  const movieId = req.params.movieId;

  // check if movieId is valid
  const movieFound = await Movies.findById(movieId);
  if (!movieFound) {
    return response.noMovieWithMovieId(res, movieId);
  } else {
    // update user with movieId
    const updatedUser = await Users.findOneAndUpdate(
      { username: username },
      { $addToSet: { favouriteMovies: movieId } },
      { new: true }
    );
    if (!updatedUser) {
      return response.noUserWithUsername(res, username);
    } else {
      return response.success(res, updatedUser);
    }
  }
};

exports.removeMovie = async (req, res) => {
  const username = req.params.username;
  const movieId = req.params.movieId;

  //check if movieId exists
  const movieFound = await Movies.findById(movieId);
  if (!movieFound) {
    return response.noMovieWithMovieId(res, movieId);
  } else {
    const updatedUser = await Users.findOneAndUpdate(
      { username: username },
      { $pull: { favouriteMovies: movieId } },
      { new: true }
    );
    if (!updatedUser) {
      return response.noUserWithUsername(res, username);
    } else {
      return response.success(res, updatedUser);
    }
  }
};

exports.deleteUser = async (req, res) => {
  const username = req.params.username;
  const deletedUser = await Users.findOneAndDelete({ username: username });
  if (!deletedUser) {
    return response.noUserWithUsername(res, username);
  } else {
    return response.success(res, deletedUser);
  }
};
