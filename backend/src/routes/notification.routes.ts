import express from 'express';
import { auth } from '../middleware/auth';
import { NotificationService } from '../services/notification.service';

const router = express.Router();

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { email, sms } = req.body;
    const userId = (req as any).user._id;

    const updatedUser = await NotificationService.updateNotificationPreferences(userId, {
      email,
      sms
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update notification preferences' });
  }
});

// Get notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const user = await NotificationService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      email: user.notificationPreferences.email,
      sms: user.notificationPreferences.sms
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get notification preferences' });
  }
});

export default router; 