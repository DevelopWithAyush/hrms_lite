import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Total employees
    const totalEmployees = await Employee.countDocuments();

    // Today's attendance
    const todayAttendance = await Attendance.find({ date: todayStr })
      .populate('employee', 'employeeId fullName email department')
      .select('-__v')
      .sort({ createdAt: -1 });

    const todayPresentCount = todayAttendance.filter(
      (att) => att.status === 'Present'
    ).length;
    const todayAbsentCount = todayAttendance.filter(
      (att) => att.status === 'Absent'
    ).length;

    res.json({
      success: true,
      dashboard: {
        totalEmployees,
        todayPresentCount,
        todayAbsentCount,
        todayAttendance,
        todayDate: todayStr,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
    });
  }
};
