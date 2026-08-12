import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MongoDB URI is not configured. Starting backend without a database connection.');
      return null;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB connection unavailable: ${error.message}`);
    console.warn('Starting backend without a database connection. Some endpoints may be unavailable.');
    return null;
  }
};

export default connectDB;

