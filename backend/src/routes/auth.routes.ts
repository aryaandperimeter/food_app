import express from 'express';
import { AuthService } from '../services/auth.service';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const result = await AuthService.register(userData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req: any, res) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Update notification preferences
router.patch('/notification-preferences', auth, async (req: any, res) => {
  try {
    const { email, sms } = req.body;
    const user = await AuthService.updateNotificationPreferences(req.user.id, { email, sms });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 