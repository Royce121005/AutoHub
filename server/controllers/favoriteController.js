const Favorite = require('../models/Favorite');
const Car = require('../models/Car');

// @desc    Add a car listing to favorites
// @route   POST /api/favorites/:carId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const carId = req.params.carId;
    const userId = req.user.id;

    // Check if the car listing exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car listing not found' });
    }

    // Check if it is already favorited by this user
    const existingFav = await Favorite.findOne({ userId, carId });
    if (existingFav) {
      return res.status(400).json({ success: false, message: 'Car is already in your favorites' });
    }

    // Create favorite
    const favorite = await Favorite.create({
      userId,
      carId
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites successfully',
      favorite
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error adding favorite' });
  }
};

// @desc    Remove a car listing from favorites
// @route   DELETE /api/favorites/:carId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const carId = req.params.carId;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({ userId, carId });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error removing favorite' });
  }
};

// @desc    Get all saved cars for logged-in user
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch and populate details of favorited cars
    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'carId',
        populate: {
          path: 'sellerId',
          select: 'name email phone city profileImage'
        }
      })
      .sort({ createdAt: -1 });

    // Filter out favorites whose cars might have been deleted (defensive fallback)
    const validFavorites = favorites.filter(fav => fav.carId !== null);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      favorites: validFavorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving favorites' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites
};
