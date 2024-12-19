require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// CORS configuration semplificata per il debug
app.use(cors());

// Il resto delle configurazioni
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crea e verifica la cartella uploads
const uploadsDir = path.join(__dirname, '../uploads');
console.log('Checking uploads directory');
const initUploads = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    // Test write permissions
    const testFile = path.join(uploadsDir, 'test.txt');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    console.log('Uploads directory is ready and writable');
  } catch (error) {
    console.error('Error setting up uploads directory:', error);
    process.exit(1);
  }
};
initUploads();

// Serve static files dalla cartella uploads
app.use('/uploads', express.static(uploadsDir));

// Routes
const photoRoutes = require('./routes/photoRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/photos', photoRoutes);
app.use('/api/admin', adminRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PAROMEOSI API' });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Database connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Avvia il listener delle email
  const { startEmailListener } = require('./services/imapService');
  startEmailListener();
  
  // Avvia il server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;