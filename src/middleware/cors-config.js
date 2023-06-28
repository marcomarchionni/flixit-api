const cors = require('cors');

const allowedOrigins = [
  'http://www.testsite.com',
  'https://flix-it.netlify.app',
  'http://localhost:1234',
  'http://localhost:4200',
  'https://marcomarchionni.github.io/flixit-angular-client/',
];

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
