import express from 'express';
import { registerUser, authUser, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);

export default router;
