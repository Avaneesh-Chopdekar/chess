import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/chess',
    );
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
}
