const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const vendorRoutes = require('./routes/vendorRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const tenderRoutes = require('./routes/tenderRoutes.js');
const bidRoutes = require('./routes/bidRoutes.js');

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To accept JSON data in the body

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount the routers
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bids', bidRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));