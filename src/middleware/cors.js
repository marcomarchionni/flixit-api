const { CORSError } = require('../errors/custom-errors');

cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new CORSError(origin), false);
    }
    // origin is allowed
    return callback(null, true);
  },
};

exports.applyCORSPolicy = cors();
