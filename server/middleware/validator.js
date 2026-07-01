const { check, validationResult } = require('express-validator');
const fs = require('fs');

// Error checker middleware
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Clean up uploaded files if validation fails to prevent orphaned uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error(`Error deleting uploaded file: ${err.message}`);
        }
      });
    }

    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Register Validation Rules
const registerValidator = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  check('phone', 'Phone number is required').notEmpty().trim(),
  check('city', 'City is required').notEmpty().trim(),
  validateResult
];

// Login Validation Rules
const loginValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
  validateResult
];

// Car Listing Validation Rules
const carValidator = [
  check('title', 'Title is required').notEmpty().trim(),
  check('brand', 'Brand is required').notEmpty().trim(),
  check('model', 'Model is required').notEmpty().trim(),
  check('year', 'A valid year is required').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('fuelType', 'Fuel type must be Petrol, Diesel, Electric, Hybrid, CNG, or LPG')
    .isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']),
  check('transmission', 'Transmission must be Manual or Automatic')
    .isIn(['Manual', 'Automatic']),
  check('owner', 'Owner type must be First, Second, Third, or Fourth & Above')
    .isIn(['First', 'Second', 'Third', 'Fourth & Above']),
  check('kilometers', 'Kilometers driven must be a positive number').isInt({ min: 0 }),
  check('color', 'Color is required').notEmpty().trim(),
  check('registrationState', 'Registration state is required').notEmpty().trim(),
  check('insurance', 'Insurance status must be Comprehensive, Third-party, Expired, or No Insurance')
    .isIn(['Comprehensive', 'Third-party', 'Expired', 'No Insurance']),
  check('description', 'Description is required').notEmpty().trim(),
  check('city', 'City is required').notEmpty().trim(),
  validateResult
];

// Profile Update Validation Rules
const profileValidator = [
  check('name', 'Name is required').notEmpty().trim(),
  check('phone', 'Phone number is required').notEmpty().trim(),
  check('city', 'City is required').notEmpty().trim(),
  validateResult
];

// Password Change Validation Rules
const passwordValidator = [
  check('currentPassword', 'Current password is required').notEmpty(),
  check('newPassword', 'New password must be at least 8 characters long').isLength({ min: 8 }),
  validateResult
];

module.exports = {
  registerValidator,
  loginValidator,
  carValidator,
  profileValidator,
  passwordValidator
};
