require('dotenv').config();
const mongoose = require('mongoose');

// work on understanding of async and await
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error.message);
    process.exit(1);
  }
};

// I guess we have to export functions?
module.exports = connectDB