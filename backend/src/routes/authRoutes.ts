import { Router } from 'express';
import {
  sendOTP,
  verifyOTPController,
  getMe,
  logout,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

export default router;
