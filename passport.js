const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

const Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
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
            console.log('Invalid username');
            return callback(null, false, {
              message: 'Invalid username or password',
            });
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
