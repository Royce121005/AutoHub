const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  markAsSold
} = require('../controllers/carController');
const { protect } = require('../middleware/auth');
const { uploadCarImages } = require('../middleware/upload');
const { carValidator } = require('../middleware/validator');

// Public routes
router.get('/', getCars);
router.get('/:id', getCarById);

// Protected routes
router.post('/', protect, uploadCarImages, carValidator, createCar);
router.put('/:id', protect, uploadCarImages, updateCar); // validator omitted on edits to allow partial updates
router.delete('/:id', protect, deleteCar);
router.patch('/:id/sold', protect, markAsSold);

module.exports = router;
