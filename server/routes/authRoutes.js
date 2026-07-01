const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  profileValidator,
  passwordValidator
} = require('../middleware/validator');

// Public routes
router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, profileValidator, updateUserProfile);
router.put('/change-password', protect, passwordValidator, changePassword);
router.delete('/delete-account', protect, deleteUserAccount);

module.exports = router;
