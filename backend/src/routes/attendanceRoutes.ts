import { Router } from 'express';
import {
  createAttendance,
  getAttendanceByEmployee,
  getAttendanceByDate,
  getAllAttendance,
} from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All attendance routes require authentication
router.use(authMiddleware);

router.post('/', createAttendance);
router.get('/employee/:employeeId', getAttendanceByEmployee);
router.get('/date', getAttendanceByDate);
router.get('/summary', getAllAttendance);

export default router;
