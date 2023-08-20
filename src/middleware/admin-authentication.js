const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const InvalidCredentialsError = require('../error-handling/errors/invalid-credentials-error');
const UnauthorizedError = require('../error-handling/errors/unauthorized-error');

passport.use(
  'admin-local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, callback) => {
      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return callback(null, { isAdmin: true, username });
      }
      return callback(new InvalidCredentialsError());
    }
  )
);

exports.localAuth = (req, res, next) => {
  passport.authenticate(
    'admin-local',
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        next(new UnauthorizedError());
        return;
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
