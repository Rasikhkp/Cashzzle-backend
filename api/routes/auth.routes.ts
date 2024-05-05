import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/forget-password', authController.forgetPassword);
router.post('/new-password', authController.resetPassword);
router.get('/refresh-token', authController.refreshToken);

export default router;
