/**
 * @file Defines validation rules and error handling functions for user data.
 * @version 1.0.0
 */

const { body, validationResult } = require('express-validator');
const ValidationErrors = require('../error-handling/errors/validation-error');

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

/**
 * Rules for the object required to create a new user.
 */
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

/**
 * Rules for the object required to update a user
 */
exports.updateUserRules = [
  usernameAlphanumeric.optional(),
  usernameLength.optional(),
  passwordLength.optional(),
  emailRules.optional(),
  birthdayRules.optional(),
];

/**
 * Handles the validation results and throws a ValidationErrors object if errors exist.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.handleResults = (req, res, next) => {
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return next(new ValidationErrors(errors));
  }
  return next();
};
