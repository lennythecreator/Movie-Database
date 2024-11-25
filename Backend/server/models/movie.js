const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: Number,
  title: String,
  overview: String,
  poster: String,
  genre_ids: [Number],
  watched: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 10 },
  review: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
movieSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model('Movie', movieSchema);

module.exports = User;
