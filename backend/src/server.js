const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Standard middleware
app.use(cors());

// Increase JSON body parser limit to support base64 image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Base route for API check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to 3W Social Post API' });
});

// Fallback Route (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
