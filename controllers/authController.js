import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import asyncHandler from 'express-async-handler';

// Generate JWT token
const generateToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

// Generate refresh token
const generateRefreshToken = async (userId, deviceInfo = {}) => {
  return await RefreshToken.createToken(userId, deviceInfo);
};

// @desc    Register user
// @route   POST /auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate tokens
  const accessToken = generateToken(user._id);
  const refreshToken = await generateRefreshToken(user._id, {
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  res.created(
    {
      access_token: accessToken,
      refresh_token: refreshToken.token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    'User registered successfully'
  );
});

// @desc    Login user
// @route   POST /auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    res.status(423);
    throw new Error(
      'Account is temporarily locked due to too many failed login attempts'
    );
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateToken(user._id);
  const refreshToken = await generateRefreshToken(user._id, {
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  res.success(
    {
      access_token: accessToken,
      refresh_token: refreshToken.token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    'Login successful'
  );
});

// @desc    Logout user
// @route   POST /auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (refresh_token) {
    // Revoke the specific refresh token
    const token = await RefreshToken.findOne({ token: refresh_token });
    if (token) {
      await token.revoke();
    }
  }

  res.success({}, 'Logged out successfully');
});

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.success(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
    'Profile retrieved successfully'
  );
});

// @desc    Refresh access token
// @route   POST /auth/token/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  // Find valid refresh token
  const token = await RefreshToken.findValidToken(refresh_token);
  if (!token) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  // Generate new access token
  const accessToken = generateToken(token.user._id);

  res.success(
    {
      access_token: accessToken,
    },
    'Token refreshed successfully'
  );
});

// @desc    Verify email
// @route   POST /auth/email/verify
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.success({}, 'Email verified successfully');
});

// @desc    Resend email verification
// @route   POST /auth/email/resend
// @access  Private
export const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  const token = user.generateEmailVerificationToken();
  await user.save();

  // TODO: Send verification email
  console.log(`Email verification token for ${user.email}: ${token}`);

  res.success({}, 'Verification email sent');
});

// @desc    Reset password
// @route   POST /auth/password/reset
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const token = user.generatePasswordResetToken();
  await user.save();

  // TODO: Send password reset email
  console.log(`Password reset token for ${user.email}: ${token}`);

  res.success({}, 'Password reset email sent');
});

// @desc    Confirm password reset
// @route   POST /auth/password/reset/confirm
// @access  Public
export const confirmPasswordReset = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.success({}, 'Password reset successfully');
});

// @desc    Change password
// @route   POST /auth/password/change
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  const user = await User.findById(req.user.userId).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(current_password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = new_password;
  await user.save();

  res.success({}, 'Password changed successfully');
});

// @desc    Google OAuth initiation
// @route   GET /auth/google/init
// @access  Public
export const googleAuthInit = asyncHandler(async (req, res) => {
  // TODO: Implement Google OAuth initiation
  res.success({}, 'Google OAuth initiation - to be implemented');
});

// @desc    Google OAuth callback
// @route   GET /auth/google/callback
// @access  Public
export const googleAuthCallback = asyncHandler(async (req, res) => {
  // TODO: Implement Google OAuth callback
  res.success({}, 'Google OAuth callback - to be implemented');
});

// @desc    Link Google account
// @route   GET /auth/google/token
// @access  Private
export const linkGoogleAccount = asyncHandler(async (req, res) => {
  // TODO: Implement Google account linking
  res.success({}, 'Google account linking - to be implemented');
});

// @desc    Unlink Google account
// @route   DELETE /auth/google/token
// @access  Private
export const unlinkGoogleAccount = asyncHandler(async (req, res) => {
  // TODO: Implement Google account unlinking
  res.success({}, 'Google account unlinking - to be implemented');
});
