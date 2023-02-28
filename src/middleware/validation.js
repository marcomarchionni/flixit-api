const { body, validationResult } = require('express-validator');
const { ValidationErrors } = require('../errors/custom-errors');

const usernameExists = body('username', 'Username is required').exists({
  checkFalsy: true,
});
const passwordExists = body('password', 'Password is required').exists({
  checkFalsy: true,
});
const emailExists = body('email', 'Email is required').exists({
  checkFalsy: true,
});
const usernameAlphanumeric = body(
  'username',
  'Username allows only letters and numbers'
)
  .isAlphanumeric()
  .isLength({
    min: 3,
  });
const usernameLength = body(
  'username',
  'Username should be at least 3 characters long'
).isLength({ min: 3 });

const passwordLength = body(
  'password',
  'Password should be at least 4 characters long'
).isLength({
  min: 4,
});

const emailRules = body('email', 'Invalid email format').isEmail();
const birthdayRules = body('birthday', 'Invalid date format').isDate();

exports.createUserRules = [
  usernameExists,
  usernameAlphanumeric,
  usernameLength,
  passwordExists,
  passwordLength,
  emailExists,
  emailRules,
  birthdayRules.optional(),
];

exports.updateUserRules = [
  usernameAlphanumeric.optional(),
  usernameLength.optional(),
  passwordLength.optional(),
  emailRules.optional(),
  birthdayRules.optional(),
];

exports.handleResults = (req, res, next) => {
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    next(new ValidationErrors(errors));
  } else {
    next();
  }
};
