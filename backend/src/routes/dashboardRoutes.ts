import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getDashboard);

export default router;
