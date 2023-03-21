const { sign } = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { Users } = require('../models/models');
const InvalidCredentialsError = require('../error-handling/errors/invalid-credentials-error');
const UnauthorizedError = require('../error-handling/errors/unauthorized-error');
const ServerError = require('../error-handling/errors/server-error');

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
            throw new InvalidCredentialsError();
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

const generateJWTToken = (user) =>
  sign(user, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });

exports.localAuth = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
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
