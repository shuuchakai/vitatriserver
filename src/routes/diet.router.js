import { Router } from 'express';

import { createDiet, getDiets, generateDiet } from '../controllers/diet.controller.js';

const router = Router();

router.post('/create', createDiet);
router.post('/get', getDiets);
router.post('/generate', generateDiet);

export default router;