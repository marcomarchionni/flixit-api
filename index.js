const express = require('express'),
  dbConnection = require('./src/db-connection/db-connection.js'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('./src/middleware/cors'),
  routes = require('./src/routes/routes'),
  {
    customErrorHandler,
    invalidPathHandler,
    errorLogger,
  } = require('./src/errors/error-handlers');

const app = express();

// Database connection
dbConnection.connect();

// Logging
app.use(morgan('common'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
app.use(cors.applyCORSPolicy);

// Routes
app.use(routes);

// Error Handling
app.use(errorLogger);
app.use(customErrorHandler);
app.use(invalidPathHandler);

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Movie App is listening on port ${process.env.PORT}.`);
});
