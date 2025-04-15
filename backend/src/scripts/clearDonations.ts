import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donation from '../models/Donation';

dotenv.config();

async function clearDonations() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-donations';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete all documents in the donations collection
    const result = await Donation.deleteMany({});
    console.log(`Deleted ${result.deletedCount} donations`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error clearing donations:', error);
  }
}

clearDonations(); 