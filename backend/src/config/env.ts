import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || '5000',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hrms-lite',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  // Email configuration
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
} as const;
