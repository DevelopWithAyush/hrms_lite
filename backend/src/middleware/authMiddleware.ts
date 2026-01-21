import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const decoded = verifyToken(token);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
