import express, { Request, Response } from 'express';
import Donation from '../models/Donation';
import { auth } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// Get all donations
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations || []);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Create a new donation
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    // Verify user exists and is a restaurant
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'restaurant') {
      return res.status(403).json({ error: 'Only restaurants can create donations' });
    }

    // Validate dates
    const { expiration, pickupTime } = req.body;
    const now = new Date();
    if (new Date(expiration) <= now) {
      return res.status(400).json({ error: 'Expiration date must be in the future' });
    }
    if (new Date(pickupTime) <= now) {
      return res.status(400).json({ error: 'Pickup time must be in the future' });
    }

    const donation = new Donation({
      ...req.body,
      restaurantName: user.name,
      phoneNumber: user.phoneNumber,
    });
    const savedDonation = await donation.save();
    res.status(201).json(savedDonation);
  } catch (error: any) {
    console.error('Error creating donation:', error);
    res.status(400).json({ error: 'Failed to create donation' });
  }
});

// Claim a donation
router.patch('/:id/claim', auth, async (req: Request, res: Response) => {
  try {
    // Verify user exists and is a shelter
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'shelter') {
      return res.status(403).json({ error: 'Only shelters can claim donations' });
    }

    const { id } = req.params;
    
    // Use findOneAndUpdate for atomic operation
    const donation = await Donation.findOneAndUpdate(
      { 
        _id: id,
        status: 'Available' // Only update if status is Available
      },
      { 
        $set: { 
          status: 'Claimed',
          claimedBy: user.name
        }
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found or already claimed' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Error claiming donation:', error);
    res.status(500).json({ error: 'Failed to claim donation' });
  }
});

// Update donation status to picked up
router.patch('/:id/pickup', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Use findOneAndUpdate for atomic operation
    const donation = await Donation.findOneAndUpdate(
      { 
        _id: id,
        status: 'Claimed',
        $or: [
          { claimedBy: user.name },
          { restaurantName: user.name }
        ]
      },
      { 
        $set: { status: 'Picked Up' }
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found or not eligible for pickup' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ error: 'Failed to update donation status' });
  }
});

export default router; 