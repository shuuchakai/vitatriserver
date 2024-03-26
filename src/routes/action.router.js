import express from 'express';

import { calculateGoalProgress, updateAction } from '../controllers/action.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/calculate-goal-progress/:id', authenticate, calculateGoalProgress);
router.put('/update-action/:id', authenticate, updateAction);

export default router;