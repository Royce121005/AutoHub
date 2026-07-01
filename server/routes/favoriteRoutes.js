const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All favorites routes require authentication
router.use(protect);

router.get('/', getFavorites);
router.post('/:carId', addFavorite);
router.delete('/:carId', removeFavorite);

module.exports = router;
