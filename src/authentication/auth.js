const jwt = require('jsonwebtoken'),
  passport = require('passport');
require('./passport-config');

const generateJWTToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

exports.localAuthentication = (req, res) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: info || 'Something is not right',
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      const token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
};

exports.JWTAutentication = passport.authenticate('jwt', { session: false });
