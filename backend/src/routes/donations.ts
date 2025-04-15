import express, { Request, Response } from 'express';
import Donation from '../models/Donation';

const router = express.Router();

// Get all donations
router.get('/', async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    // Return empty array instead of error when no donations exist
    res.json(donations || []);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

// Create a new donation
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Creating donation with data:', req.body);
    const donation = new Donation(req.body);
    const savedDonation = await donation.save();
    console.log('Successfully created donation:', savedDonation);
    res.status(201).json(savedDonation);
  } catch (error: any) {
    console.error('Error creating donation:', error);
    res.status(400).json({ 
      message: 'Error creating donation', 
      error: error.message 
    });
  }
});

// Claim a donation
router.patch('/:id/claim', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { shelterName } = req.body;

    console.log(`Attempting to claim donation ${id} by shelter ${shelterName}`);

    if (!shelterName) {
      console.error('Shelter name is required');
      return res.status(400).json({ message: 'Shelter name is required' });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      console.error(`Donation ${id} not found`);
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'Available') {
      console.error(`Donation ${id} is not available. Current status: ${donation.status}`);
      return res.status(400).json({ message: 'Donation is not available' });
    }

    donation.status = 'Claimed';
    donation.claimedBy = shelterName;
    await donation.save();

    console.log(`Successfully claimed donation ${id} by shelter ${shelterName}`);
    res.json(donation);
  } catch (error: any) {
    console.error('Error claiming donation:', error);
    res.status(500).json({ message: 'Error claiming donation', error: error.message });
  }
});

// Update donation status to picked up
router.patch('/:id/pickup', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'Claimed') {
      return res.status(400).json({ message: 'Donation must be claimed first' });
    }

    donation.status = 'Picked Up';
    await donation.save();

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating donation status' });
  }
});

export default router; 