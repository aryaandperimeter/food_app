import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  foodName: string;
  description: string;
  quantity: string;
  expiration: Date;
  pickupTime: Date;
  notes?: string;
  status: 'Available' | 'Claimed' | 'Picked Up';
  restaurantName: string;
  phoneNumber: string;
  claimedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    foodName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    expiration: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Picked Up'],
      default: 'Available',
    },
    restaurantName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    claimedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDonation>('Donation', donationSchema); 