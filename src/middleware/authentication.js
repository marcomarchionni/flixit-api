/**
 * @file Defines authentication middleware and helper functions for user authentication.
 * @version 1.0.0
 */

const { sign } = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { Users } = require('../models/models');
const InvalidCredentialsError = require('../error-handling/errors/invalid-credentials-error');
const UnauthorizedError = require('../error-handling/errors/unauthorized-error');
const ServerError = require('../error-handling/errors/server-error');
const InvalidRequestError = require('../error-handling/errors/invalid-request');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, callback) => {
      Users.findOne({ username })
        .then((user) => {
          if (!user || !user.validatePassword(password)) {
            return callback(new InvalidCredentialsError());
          }
          // valid user
          return callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayLoad, callback) => {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const user = await Users.findById(jwtPayLoad._id);
        return callback(null, user);
      } catch (err) {
        return callback(err);
      }
    }
  )
);

/**
 * Generates a JWT token for a given user.
 * @param {object} user - The user object.
 * @returns {string} The generated JWT token.
 */
const generateJWTToken = (user) =>
  sign(user, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });

/**
 * Authenticates a user using the username and password and
 * generates a JWT token which is added to the response
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.localAuth = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (!user) {
      next(new InvalidRequestError(info && info.message));
      return;
    }
    if (err) {
      next(err);
      return;
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        return next(new ServerError(error));
      }
      const token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res, next);
};

/**
 * Authenticates a user using JSON Web Token (JWT).
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.JWTAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(new UnauthorizedError(err));
    }
    const userIsInvalid = !user;
    const pathUsernameIsDifferentFromTokenUsername =
      req.params.username && req.params.username !== user.username;
    if (userIsInvalid || pathUsernameIsDifferentFromTokenUsername) {
      return next(new UnauthorizedError());
    }
    return next();
  })(req, res, next);
};
