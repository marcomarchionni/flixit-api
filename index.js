/**
 * @file Flixit API - Main Server File
 * @version 1.0.0
 * @description This is the main file of the Flixit API server. It sets up the server, establishes
 * a connection to the MongoDB database, configures middleware, defines routes, and handles error
 * responses. The server listens for incoming requests and provides responses accordingly.
 */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dbConnection = require('./src/db-connection/db-connection');
const routes = require('./src/routes/routes');
const {
  customErrorHandler,
  invalidPathHandler,
  errorLogger,
} = require('./src/error-handling/error-handlers');
const { corsConfig } = require('./src/middleware/cors-config');

const app = express();

// Database connection
dbConnection.connect();

// Logging
app.use(morgan('common'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow all Cross Origin Requests
app.use(corsConfig);

// Routes
app.use(routes);

// Error Handling
app.use(errorLogger);
app.use(customErrorHandler);
app.use(invalidPathHandler);

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Movie App is listening on port ${process.env.PORT}.`);
});
