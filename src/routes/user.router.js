import express from 'express';

import { register, login, forgotPassword, resetPassword, confirmEmail, updatePassword } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/confirm/:token', confirmEmail);

router.put('/update-password', authenticate, updatePassword);

export default router;