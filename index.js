const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  response = require('./src/responses/responses.js'),
  routes = require('./src/routes/routes');

const app = express();

// Database connection
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/flixdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Logging
app.use(morgan('common'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
const allowedOrigins = ['http://localhost:8080'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      // origin is allowed
      return callback(null, true);
    },
  })
);

// Static Requests
app.use(express.static('src/public'));

// API requests
app.use('/', routes);

// Error Handling
app.use((err, req, res, next) => {
  response.serverError(res, err);
});

// Listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Movie App is listening on port ${process.env.PORT}.`);
});
