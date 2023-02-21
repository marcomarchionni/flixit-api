const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  year: String,
  genre: {
    name: String,
    description: String,
  },
  director: {
    name: { type: String, required: true },
    born: Date,
    died: Date,
    bio: String,
  },
  stars: [
    {
      name: { type: String, required: true },
      born: Date,
      died: Date,
      bio: String,
    },
  ],
  imageUrl: String,
  featured: Boolean,
});

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
