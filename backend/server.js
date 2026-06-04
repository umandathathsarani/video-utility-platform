require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/video', videoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});