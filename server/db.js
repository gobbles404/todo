require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to', process.env.MONGODB_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected');
});

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

module.exports = connectDB;
