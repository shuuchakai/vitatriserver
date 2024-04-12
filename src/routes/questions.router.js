import { Router } from 'express';

import { createQuestion, getQuestions } from '../controllers/questions.controller.js';

const router = Router();

router.post('/create', createQuestion);
router.post('/get', getQuestions);

export default router;