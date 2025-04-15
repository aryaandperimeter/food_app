import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Document } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

// Define types for the user document and response
type UserDocument = Document & IUser;
type UserResponse = Omit<IUser, 'password'> & { _id: string };

export class AuthService {
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: 'shelter' | 'restaurant';
  }): Promise<{ user: UserResponse; token: string }> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = new User(userData);
      await user.save();

      const token = this.generateToken(user);
      const userResponse = this.getUserResponse(user);

      return { user: userResponse, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user);
      const userResponse = this.getUserResponse(user);

      return { user: userResponse, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<UserResponse | null> {
    try {
      const user = await User.findById(id);
      return user ? this.getUserResponse(user) : null;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  static async updateNotificationPreferences(
    userId: string,
    preferences: { email: boolean; sms: boolean }
  ): Promise<UserResponse> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { notificationPreferences: preferences },
        { new: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return this.getUserResponse(user);
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  }

  private static generateToken(user: Document): string {
    return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  private static getUserResponse(user: Document): UserResponse {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as UserResponse;
  }
} 