import { Router } from 'express';
import {
  createEmployee,
  getEmployees,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All employee routes require authentication
router.use(authMiddleware);

router.post('/', createEmployee);
router.get('/', getEmployees);
router.delete('/:id', deleteEmployee);

export default router;
