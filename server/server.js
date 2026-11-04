const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  try {
    const Car = require('./models/Car');
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log('Database empty on startup. Automatically seeding initial demo listings...');
      const { seedDatabase } = require('./seed');
      if (typeof seedDatabase === 'function') {
        await seedDatabase(false);
      }
    }
  } catch (seedErr) {
    console.warn('Auto-seed check notice:', seedErr.message);
  }
}).catch(err => {
  console.warn('DB connection startup notice:', err.message);
});

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false // Allows client to request images loaded from local server storage
  })
);

// CORS Configuration
app.use(
  cors({
    origin: '*', // Allowed origins (Vercel frontend will connect)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: 'Too many requests from this IP address. Please try again in 15 minutes.' }
});
app.use('/api', limiter);

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload assets statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// Root ping route
app.get('/', (req, res) => {
  res.json({ message: 'AutoHub API is active and running.' });
});

// Fallback Route for Undefined Enpoints (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Requested API endpoint does not exist.' });
});

// Global Centralized Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle multer specific upload size/type limits errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File is too large! Maximum limit is 5MB.' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AutoHub Server running on port ${PORT}`);
});
