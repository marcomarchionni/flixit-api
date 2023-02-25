const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports.Movies = mongoose.model('Movie', movieSchema);
module.exports.Users = mongoose.model('User', userSchema);
