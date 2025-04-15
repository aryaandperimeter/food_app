import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { User } from '../models/User';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer transporter
const emailTransporter = nodemailer.createTransport({
  // Configure your email service here
  // For development, you can use a service like Mailtrap
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  auth: {
    user: process.env.EMAIL_USER || 'your-mailtrap-user',
    pass: process.env.EMAIL_PASS || 'your-mailtrap-password',
  },
});

export class NotificationService {
  static async notifyNewDonation(donationData: {
    restaurantName: string;
    foodItems: string;
    quantity: number;
    expiryTime: string;
  }) {
    try {
      // Find all shelter users
      const shelters = await User.find({ 
        role: 'shelter',
        $or: [
          { 'notificationPreferences.email': true },
          { 'notificationPreferences.sms': true }
        ]
      });

      // Send notifications to each shelter
      for (const shelter of shelters) {
        // Send email notification if enabled
        if (shelter.notificationPreferences.email) {
          await this.sendEmail(
            shelter.email,
            'New Food Donation Available!',
            this.createEmailContent(donationData)
          );
        }

        // Send SMS notification if enabled
        if (shelter.notificationPreferences.sms) {
          await this.sendSMS(
            shelter.phoneNumber,
            this.createSMSContent(donationData)
          );
        }
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  private static async sendEmail(to: string, subject: string, content: string) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@foodconnector.com',
        to,
        subject,
        html: content,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  private static async sendSMS(to: string, content: string) {
    try {
      await twilioClient.messages.create({
        body: content,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  private static createEmailContent(donationData: {
    restaurantName: string;
    foodItems: string;
    quantity: number;
    expiryTime: string;
  }): string {
    return `
      <h2>New Food Donation Available!</h2>
      <p>A new donation has been posted:</p>
      <ul>
        <li><strong>Restaurant:</strong> ${donationData.restaurantName}</li>
        <li><strong>Food Items:</strong> ${donationData.foodItems}</li>
        <li><strong>Quantity:</strong> ${donationData.quantity} portions</li>
        <li><strong>Expires:</strong> ${new Date(donationData.expiryTime).toLocaleString()}</li>
      </ul>
      <p>Log in to claim this donation!</p>
    `;
  }

  private static createSMSContent(donationData: {
    restaurantName: string;
    foodItems: string;
    quantity: number;
    expiryTime: string;
  }): string {
    return `New donation available from ${donationData.restaurantName}! ${donationData.quantity} portions of ${donationData.foodItems}. Expires: ${new Date(donationData.expiryTime).toLocaleString()}. Log in to claim!`;
  }
} 