import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ,
  mongoUri: process.env.MONGO_URI ,
  jwtSecret: process.env.JWT_SECRET ,
  clientUrl: process.env.CLIENT_URL ,
  nodeEnv: process.env.NODE_ENV ,
  // Email configuration
  emailHost: process.env.EMAIL_HOST ,
  emailPort: process.env.EMAIL_PORT ,
  emailUser: process.env.EMAIL_USER ,
  emailPassword: process.env.EMAIL_PASSWORD ,
  emailFrom: process.env.EMAIL_FROM ,
} as const;
