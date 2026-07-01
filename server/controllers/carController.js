const Car = require('../models/Car');
const Favorite = require('../models/Favorite');
const fs = require('fs');
const path = require('path');

// @desc    Get all cars with filters, sorting, and pagination
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    // Build filter query object
    let filter = {};

    // Defaults to only showing available cars, unless listing specific seller's cars
    if (req.query.sellerId) {
      filter.sellerId = req.query.sellerId;
    } else {
      filter.status = 'available';
    }

    if (req.query.status && req.query.sellerId) {
      filter.status = req.query.status;
    }

    // Direct filters (exact match)
    if (req.query.fuelType) filter.fuelType = req.query.fuelType;
    if (req.query.transmission) filter.transmission = req.query.transmission;
    if (req.query.owner) filter.owner = req.query.owner;

    // Text search (partial match on brand, model, title, city)
    if (req.query.brand) filter.brand = { $regex: req.query.brand, $options: 'i' };
    if (req.query.model) filter.model = { $regex: req.query.model, $options: 'i' };
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };

    // Range queries
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minYear || req.query.maxYear) {
      filter.year = {};
      if (req.query.minYear) filter.year.$gte = Number(req.query.minYear);
      if (req.query.maxYear) filter.year.$lte = Number(req.query.maxYear);
    }

    if (req.query.minKm || req.query.maxKm) {
      filter.kilometers = {};
      if (req.query.minKm) filter.kilometers.$gte = Number(req.query.minKm);
      if (req.query.maxKm) filter.kilometers.$lte = Number(req.query.maxKm);
    }

    // Keyword search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
        { city: searchRegex }
      ];
    }

    // Determine sorting options
    let sort = {};
    switch (req.query.sort) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'priceLowToHigh':
        sort = { price: 1 };
        break;
      case 'priceHighToLow':
        sort = { price: -1 };
        break;
      case 'yearNewToOld':
        sort = { year: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Get total items for pagination metadata
    const total = await Car.countDocuments(filter);

    // Execute query with pagination & sorting
    const cars = await Car.find(filter)
      .populate('sellerId', 'name email phone city profileImage')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      cars
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving listings' });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('sellerId', 'name email phone city profileImage');

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car listing not found' });
    }

    res.status(200).json({ success: true, car });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Car listing not found' });
    }
    res.status(500).json({ success: false, message: 'Server error retrieving car details' });
  }
};

// @desc    Create a new car listing
// @route   POST /api/cars
// @access  Private
const createCar = async (req, res) => {
  try {
    // Collect uploaded image paths
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const carData = {
      ...req.body,
      images: imagePaths,
      sellerId: req.user.id,
      status: 'available'
    };

    // Cast fields to correct types (since form-data sends everything as string)
    carData.year = Number(carData.year);
    carData.price = Number(carData.price);
    carData.kilometers = Number(carData.kilometers);

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car listing created successfully',
      car
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error creating car listing' });
  }
};

// @desc    Update an existing car listing
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Verify ownership (Only the seller can edit)
    if (car.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const fieldsToUpdate = { ...req.body };
    
    // Manage image additions or edits (if files were uploaded)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      
      // If client sends parameter to append or overwrite:
      // For simplicity, we overwrite/update images or append them.
      // Let's overwrite, but if we do, delete old physical files:
      car.images.forEach(img => {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      fieldsToUpdate.images = newImages;
    }

    // Cast numbers properly
    if (fieldsToUpdate.year) fieldsToUpdate.year = Number(fieldsToUpdate.year);
    if (fieldsToUpdate.price) fieldsToUpdate.price = Number(fieldsToUpdate.price);
    if (fieldsToUpdate.kilometers) fieldsToUpdate.kilometers = Number(fieldsToUpdate.kilometers);

    car = await Car.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      car
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating listing' });
  }
};

// @desc    Delete a car listing
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Verify ownership
    if (car.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    // Delete associated physical image files
    car.images.forEach(img => {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete local file ${filePath}: ${err.message}`);
        }
      }
    });

    // Delete favorites referencing this car
    await Favorite.deleteMany({ carId: req.params.id });

    // Delete the car document
    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting listing' });
  }
};

// @desc    Mark listing as sold
// @route   PATCH /api/cars/:id/sold
// @access  Private
const markAsSold = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Verify ownership
    if (car.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    car.status = car.status === 'sold' ? 'available' : 'sold';
    await car.save();

    res.status(200).json({
      success: true,
      message: `Listing marked as ${car.status}`,
      status: car.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  markAsSold
};
