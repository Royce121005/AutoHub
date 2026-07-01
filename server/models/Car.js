const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a listing title'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true
  },
  variant: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please add the vehicle year'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the far future']
  },
  price: {
    type: Number,
    required: [true, 'Please add the price'],
    min: [0, 'Price must be positive']
  },
  fuelType: {
    type: String,
    required: [true, 'Please specify the fuel type'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']
  },
  transmission: {
    type: String,
    required: [true, 'Please specify the transmission'],
    enum: ['Manual', 'Automatic']
  },
  owner: {
    type: String,
    required: [true, 'Please specify the ownership history'],
    enum: ['First', 'Second', 'Third', 'Fourth & Above']
  },
  kilometers: {
    type: Number,
    required: [true, 'Please specify kilometers driven'],
    min: [0, 'Kilometers cannot be negative']
  },
  color: {
    type: String,
    required: [true, 'Please specify the exterior color'],
    trim: true
  },
  registrationState: {
    type: String,
    required: [true, 'Please specify the registration state/RTO'],
    trim: true
  },
  insurance: {
    type: String,
    required: [true, 'Please specify the insurance status'],
    enum: ['Comprehensive', 'Third-party', 'Expired', 'No Insurance']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  images: {
    type: [String],
    required: [true, 'Please upload at least one image of the vehicle']
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: [true, 'Please specify the city location of the car'],
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for text searching by brand, model, and keywords
CarSchema.index({ brand: 'text', model: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Car', CarSchema);
