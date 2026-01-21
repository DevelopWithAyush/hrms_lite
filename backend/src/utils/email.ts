import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: config.emailPort === 465, // true for 465, false for other ports
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    if (!config.emailUser || !config.emailPassword) {
      console.warn('⚠️  Email configuration incomplete. OTP emails will not be sent.');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    console.warn('⚠️  OTP emails will not be sent. Check your email configuration.');
    return false;
  }
};

// Send OTP email
export const sendOTPEmail = async (to: string, otp: string): Promise<boolean> => {
  try {
    // If email is not configured, return false
    if (!config.emailUser || !config.emailPassword) {
      console.log(`📧 OTP for ${to}: ${otp} (Email not configured - using console)`);
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"HRMS Lite" <${config.emailFrom}>`,
      to: to,
      subject: 'Your OTP for HRMS Lite Login',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">HRMS Lite</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
              <h2 style="color: #667eea; margin-top: 0;">OTP Verification</h2>
              <p>Hello,</p>
              <p>You have requested to log in to your HRMS Lite account. Please use the following One-Time Password (OTP) to complete your login:</p>
              
              <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>Important:</strong>
              </p>
              <ul style="color: #666; font-size: 14px; padding-left: 20px;">
                <li>This OTP is valid for <strong>5 minutes</strong> only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this OTP, please ignore this email</li>
              </ul>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; margin-bottom: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
        HRMS Lite - OTP Verification
        
        Hello,
        
        You have requested to log in to your HRMS Lite account. Please use the following One-Time Password (OTP) to complete your login:
        
        OTP: ${otp}
        
        Important:
        - This OTP is valid for 5 minutes only
        - Do not share this OTP with anyone
        - If you didn't request this OTP, please ignore this email
        
        This is an automated message. Please do not reply to this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${to}:`, error);
    // Still log the OTP for development purposes
    console.log(`📧 OTP for ${to}: ${otp} (Email send failed - using console)`);
    return false;
  }
};
