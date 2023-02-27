cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    // origin is allowed
    return callback(null, true);
  },
};

exports.allowOrigins = cors(corsOptions);
