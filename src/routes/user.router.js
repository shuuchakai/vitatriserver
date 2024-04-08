import express from 'express';

import { register, login, forgotPassword, resetPassword, confirmEmail, updatePassword, getUserProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/confirm', confirmEmail);

router.put('/update-password', authenticate, updatePassword);

export default router;