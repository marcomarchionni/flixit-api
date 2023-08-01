/**
 * @file Configures CORS handling for cross-origin requests.
 * @version 1.0.0
 */

const cors = require('cors');

/**
 * The list of allowed origins for CORS requests.
 * @type {string[]}
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

/**
 * Configures the CORS handling for cross-origin requests.
 * @type {function}
 */
exports.corsConfig = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If a specific origin isn’t found on the list of allowed origins
      const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
});
