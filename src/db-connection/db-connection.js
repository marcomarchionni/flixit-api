/**
 * @file Contains MongoDB connection configuration and setup.
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the provided connection URI.
 */
exports.connect = () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.error(`MongoDb connection failed: ${err}`));
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDb connection error: ${err}`);
  });
  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
  });
};
