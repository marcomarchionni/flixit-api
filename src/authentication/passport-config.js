const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  { Users } = require('../models/models.js'),
  passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, callback) => {
      console.log(`${username} ${password}`);
      Users.findOne({ username })
        .then((user) => {
          if (!user) {
            return callback(null, false, {
              message: 'Invalid username',
            });
          }
          if (!user.validatePassword(password)) {
            return callback(null, false, { message: `Invalid password` });
          }
          // valid user
          console.log('finished?');
          return callback(null, user);
        })
        .catch((err) => {
          console.log(err);
          return callback(err);
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