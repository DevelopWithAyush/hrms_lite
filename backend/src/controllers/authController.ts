import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.js';
import { generateToken } from '../utils/jwt.js';
import { config } from '../config/env.js';
import { sendOTPEmail } from '../utils/email.js';

export const sendOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    let otp: string;

    // Special case: ayushdubey2017@gmail.com always uses OTP 1111
    if (email.toLowerCase() === 'ayushdubey2017@gmail.com') {
      otp = '1111';
    } else {
      otp = generateOTP();
    }

    storeOTP(email.toLowerCase(), otp);

    // Send OTP via email
    const emailSent = await sendOTPEmail(email.toLowerCase(), otp);

    // If email sending fails, still return success but log the OTP
    // For development, also return OTP in response if email not configured
    res.json({
      success: true,
      message: emailSent
        ? 'OTP sent successfully to your email'
        : 'OTP generated. Please check console or email configuration.',
      // For development, return OTP if email not configured or in dev mode
      ...((config.nodeEnv === 'development' || !emailSent) && { otp }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

export const verifyOTPController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Email and OTP are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Verify OTP (special case for ayushdubey2017@gmail.com always accepts 1111)
    // For other users, OTP must be stored and verified
    let isValid: boolean;

    if (email.toLowerCase() === 'ayushdubey2017@gmail.com') {
      // Special case: always accept 1111
      isValid = otp === '1111';
    } else {
      // For other users, verify against stored OTP
      isValid = verifyOTP(email.toLowerCase(), otp);
    }

    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

  

    res.cookie('token', token, {
      domain: '.developwithayush.com',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-__v');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {


    res.clearCookie('token', {
      domain: '.developwithayush.com',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Failed to logout' });
  }
};
