const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only favorite a car once
FavoriteSchema.index({ userId: 1, carId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
