const mongoose = require('mongoose');

exports.connect = () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.error('MongoDb connection failed: ' + err));
  mongoose.connection.on('error', (err) => {
    console.error('MongoDb connection error: ' + err);
  });
};
