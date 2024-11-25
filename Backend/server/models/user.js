const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },
  ],
  reviews: [reviewSchema]
});
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.hashedPass;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
