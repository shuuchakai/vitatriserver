import express from 'express';

import { updateMainGoal, createGoal, getUserGoals, updateGoal, deleteGoal, updateGoalProgress } from '../controllers/goals.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticate, createGoal);

router.get('/get', authenticate, getUserGoals);

router.put('/update/:id', authenticate, updateGoal);
router.put('/update-mainGoal', authenticate, updateMainGoal);
router.put('/update-progress/:id', authenticate, updateGoalProgress);

router.delete('/delete/:id', authenticate, deleteGoal);

export default router;