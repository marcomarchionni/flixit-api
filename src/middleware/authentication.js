const {
  NoUserWithUsernameError,
  ServerError,
  InvalidCredentialsError,
} = require('../errors/custom-errors.js');

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  passportJWT = require('passport-jwt'),
  jwt = require('jsonwebtoken'),
  { Users } = require('../models/models.js');

const JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

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
      secretOrKey: 'your_jwt_secret',
    },
    (jwtPayLoad, callback) => {
      return Users.findById(jwtPayLoad._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);

const generateJWTToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

exports.localAuth = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      next(err);
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        next(new ServerError(error));
      }
      const token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res, next);
};

exports.JWTAuth = passport.authenticate('jwt', { session: false });
