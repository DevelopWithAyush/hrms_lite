import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Employee } from '../models/Employee.js';
import { z } from 'zod';

const employeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  department: z.string().min(1, 'Department is required'),
});

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = employeeSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
      return;
    }

    const { employeeId, fullName, email, department } = validation.data;

    // Check if employeeId already exists
    const existingById = await Employee.findOne({ employeeId });
    if (existingById) {
      res.status(409).json({
        success: false,
        message: 'Employee ID already exists',
      });
      return;
    }

    // Check if email already exists
    const existingByEmail = await Employee.findOne({ email: email.toLowerCase() });
    if (existingByEmail) {
      res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
      return;
    }

    const employee = new Employee({
      employeeId,
      fullName,
      email: email.toLowerCase(),
      department,
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee,
    });
  } catch (error: any) {
    console.error('Create employee error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
    });
  }
};

export const getEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
    });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Employee ID is required',
      });
      return;
    }

    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
    });
  }
};
