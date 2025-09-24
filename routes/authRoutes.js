import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  refreshToken,
  verifyEmail,
  resendEmailVerification,
  resetPassword,
  confirmPasswordReset,
  changePassword,
  googleAuthInit,
  googleAuthCallback,
  linkGoogleAccount,
  unlinkGoogleAccount,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { endpoints } from '../config/endpoints.js';

const router = express.Router();

// Basic auth routes
router.post(endpoints.auth.basic.register, register);
router.post(endpoints.auth.basic.login, login);
router.post(endpoints.auth.basic.logout, protect, logout);

// Profile routes
router.get(endpoints.auth.profile, protect, getProfile);

// Token routes
router.post(endpoints.auth.token.refresh, refreshToken);

// Email verification routes
router.post(endpoints.auth.email.verify, verifyEmail);
router.post(endpoints.auth.email.resend, protect, resendEmailVerification);

// Password routes
router.post(endpoints.auth.password.reset, resetPassword);
router.post(endpoints.auth.password.confirm, confirmPasswordReset);
router.post(endpoints.auth.password.change, protect, changePassword);

// Google OAuth routes
router.get(endpoints.auth.google.init, googleAuthInit);
router.get(endpoints.auth.google.callback, googleAuthCallback);
router.get(endpoints.auth.google.exchange, protect, linkGoogleAccount);
router.delete(endpoints.auth.google.exchange, protect, unlinkGoogleAccount);

export default router;
