const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const foodTruckRoutes = require('./routes/foodTruckRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foodtrucks', foodTruckRoutes);
app.use('/api/users', userRoutes)

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
