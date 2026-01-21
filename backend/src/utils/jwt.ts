import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): JWTPayload => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const decoded = jwt.verify(token, config.jwtSecret);
  return decoded as JWTPayload;
};
