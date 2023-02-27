const express = require('express'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('./src/middleware/cors'),
  routes = require('./src/routes/routes'),
  { customErrorHandler } = require('./src/errors/error-handlers');

const app = express();

// Database connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Logging
app.use(morgan('common'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
app.use(cors.allowOrigins);

// Routes
app.use(routes);

// Error Handling
app.use(customErrorHandler);

// Listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Movie App is listening on port ${process.env.PORT}.`);
});
