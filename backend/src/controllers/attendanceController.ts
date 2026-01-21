import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import { z } from 'zod';

const attendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['Present', 'Absent'], {
    errorMap: () => ({ message: 'Status must be either Present or Absent' }),
  }),
});

export const createAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = attendanceSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
      return;
    }

    const { employeeId, date, status } = validation.data;

    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
      return;
    }

    // Check if attendance already exists for this employee and date
    const existing = await Attendance.findOne({
      employee: employeeId,
      date,
    });

    if (existing) {
      // Update existing attendance
      existing.status = status;
      await existing.save();

      res.json({
        success: true,
        message: 'Attendance updated successfully',
        attendance: existing,
      });
      return;
    }

    const attendance = new Attendance({
      employee: employeeId,
      date,
      status,
    });

    await attendance.save();
    await attendance.populate('employee', 'employeeId fullName email department');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (error: any) {
    console.error('Create attendance error:', error);
    
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Attendance already exists for this employee and date',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
    });
  }
};

export const getAttendanceByEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      res.status(400).json({
        success: false,
        message: 'Employee ID is required',
      });
      return;
    }

    const attendances = await Attendance.find({ employee: employeeId })
      .populate('employee', 'employeeId fullName email department')
      .select('-__v')
      .sort({ date: -1 });

    // Calculate total present days
    const totalPresentDays = attendances.filter(
      (att) => att.status === 'Present'
    ).length;

    res.json({
      success: true,
      attendances,
      totalPresentDays,
    });
  } catch (error) {
    console.error('Get attendance by employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
    });
  }
};

export const getAttendanceByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Date query parameter is required (format: YYYY-MM-DD)',
      });
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({
        success: false,
        message: 'Date must be in YYYY-MM-DD format',
      });
      return;
    }

    const attendances = await Attendance.find({ date })
      .populate('employee', 'employeeId fullName email department')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      attendances,
      date,
    });
  } catch (error) {
    console.error('Get attendance by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
    });
  }
};

export const getAllAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const attendances = await Attendance.find()
      .populate('employee', 'employeeId fullName email department')
      .select('-__v')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      attendances,
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
    });
  }
};
