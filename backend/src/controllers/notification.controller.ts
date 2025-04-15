import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export const NotificationController = {
  async notifyNewDonation(req: Request, res: Response) {
    try {
      const donationData = req.body;
      await NotificationService.notifyNewDonation(donationData);
      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  }
}; 