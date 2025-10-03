const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');
const vendorRoutes = require('./routes/vendorRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const tenderRoutes = require('./routes/tenderRoutes.js');
const bidRoutes = require('./routes/bidRoutes.js');

dotenv.config();

const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To accept JSON data in the body

// Health check endpoint (must be before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Mount the API routers
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bids', bidRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Client/build')));
  
  // Handle React routing - catch all requests that don't match API routes
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0'; // Bind to all network interfaces

// Start server first, then connect to MongoDB
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health check available at: http://${HOST}:${PORT}/health`);
  
  // Connect to MongoDB after server starts
  connectDB().catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Server is running but database is not connected');
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});