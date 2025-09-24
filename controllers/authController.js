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
    return res.error('User already exists', 'USER_EXISTS', {}, 400);
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
    return res.unauthorized('Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.error(
      'Account is temporarily locked due to too many failed login attempts',
      'ACCOUNT_LOCKED',
      {},
      423
    );
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    return res.unauthorized('Invalid credentials');
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
    return res.notFound('User');
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
    return res.error('Refresh token is required', 'MISSING_TOKEN', {}, 400);
  }

  // Find valid refresh token
  const token = await RefreshToken.findValidToken(refresh_token);
  if (!token) {
    return res.unauthorized('Invalid or expired refresh token');
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
    return res.error(
      'Invalid or expired verification token',
      'INVALID_TOKEN',
      {},
      400
    );
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
    return res.error('Email is already verified', 'ALREADY_VERIFIED', {}, 400);
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
    return res.notFound('User');
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
    return res.error(
      'Invalid or expired reset token',
      'INVALID_TOKEN',
      {},
      400
    );
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
    return res.error(
      'Current password is incorrect',
      'INVALID_PASSWORD',
      {},
      400
    );
  }

  user.password = new_password;
  await user.save();

  res.success({}, 'Password changed successfully');
});

// @desc    Google OAuth initiation
// @route   GET /auth/google/init
// @access  Public
export const googleAuthInit = asyncHandler(async (req, res) => {
  // Check if Google OAuth is configured
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_CALLBACK_URL
  ) {
    return res.error(
      'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
      'OAUTH_NOT_CONFIGURED',
      {},
      503
    );
  }

  // Generate Google OAuth URL with frontend redirect URI
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUri = `${frontendUrl}/auth/google/callback`;

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=profile email&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.success({ url: authUrl }, 'Google OAuth URL generated');
});

// @desc    Exchange Google authorization code for tokens
// @route   POST /auth/google/exchange
// @access  Public
export const exchangeGoogleCode = asyncHandler(async (req, res) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.error(
      'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
      'OAUTH_NOT_CONFIGURED',
      {},
      503
    );
  }

  const { code } = req.body;

  if (!code) {
    return res.error('Authorization code is required', 'MISSING_CODE', {}, 400);
  }

  try {
    // Get frontend URL for redirect URI
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUri = `${frontendUrl}/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      return res.error('Token exchange failed', 'TOKEN_ERROR', tokens, 400);
    }

    // Get user info from Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
    );
    const googleUser = await userResponse.json();

    if (googleUser.error) {
      return res.error(
        'Failed to fetch user info',
        'USER_INFO_ERROR',
        googleUser,
        400
      );
    }

    // Simple logic: Find or create user
    let user = await User.findOne({ googleId: googleUser.id });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: googleUser.email });

      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = googleUser.id;
        existingUser.googleEmail = googleUser.email;
        existingUser.isGoogleLinked = true;
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = await User.create({
          googleId: googleUser.id,
          googleEmail: googleUser.email,
          isGoogleLinked: true,
          name: googleUser.name,
          email: googleUser.email,
          isEmailVerified: true,
        });
      }
    }

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, {
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    return res.success(
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
      'Google authentication successful'
    );
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.internalError('Google authentication failed');
  }
});
