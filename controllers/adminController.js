import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Pickup from '../models/Pickup.js';
import {
  createSearchFilter,
  calculatePaginationMetadata,
} from '../middleware/paginationMiddleware.js';

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/dashboard/stats
// @access  Private (Admin only)
export const getAdminDashboard = asyncHandler(async (req, res) => {
  // TODO: Implement admin dashboard stats
  res.success(
    {
      totalPickups: 0,
      activePickups: 0,
      completedPickups: 0,
      totalDrivers: 0,
      totalUsers: 0,
      revenue: 0,
    },
    'Admin dashboard stats retrieved successfully'
  );
});

// @desc    Get all pickups for admin
// @route   GET /api/v1/admin/pickups
// @access  Private (Admin only)
export const getAdminPickups = asyncHandler(async (req, res) => {
  const { skip, limit, search } = req.pagination;
  const { status, waste_type, urgent_only } = req.query;

  // Build base query filter
  let queryFilter = {};

  // Add search filter
  if (search) {
    const searchFilter = createSearchFilter(search, [
      'address',
      'notes',
      'special_instructions',
    ]);
    queryFilter = { ...queryFilter, ...searchFilter };
  }

  // Add status filter
  if (status && status !== 'all') {
    queryFilter.status = status;
  }

  // Add waste type filter
  if (waste_type && waste_type !== 'all') {
    queryFilter.waste_type = waste_type;
  }

  // Add urgent filter
  if (urgent_only === 'true') {
    queryFilter.urgent_pickup = true;
  }

  // Get total count for pagination
  const totalItems = await Pickup.countDocuments(queryFilter);

  // Get paginated pickups
  const pickups = await Pickup.find(queryFilter)
    .populate('user', 'name email phone')
    .populate('assigned_driver', 'name phone')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const pagination = calculatePaginationMetadata(
    totalItems,
    req.pagination.page,
    req.pagination.pageSize
  );

  res.success(
    pickups,
    'Admin pickups list retrieved successfully',
    pagination
  );
});

// @desc    Get all drivers for admin
// @route   GET /api/v1/admin/drivers
// @access  Private (Admin only)
export const getAdminDrivers = asyncHandler(async (req, res) => {
  const { skip, limit, search } = req.pagination;

  // Create search filter for driver fields
  const searchFilter = createSearchFilter(search, ['name', 'email', 'phone']);

  // Build query filter
  const queryFilter = {
    role: 'driver',
    ...searchFilter,
  };

  // Get total count for pagination
  const totalItems = await User.countDocuments(queryFilter);

  // Get paginated drivers
  const drivers = await User.find(queryFilter)
    .select(
      '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires'
    )
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const pagination = calculatePaginationMetadata(
    totalItems,
    req.pagination.page,
    req.pagination.pageSize
  );

  res.success(
    drivers,
    'Admin drivers list retrieved successfully',
    pagination
  );
});

// @desc    Get all users for admin
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
export const getAdminUsers = asyncHandler(async (req, res) => {
  const { skip, limit, search } = req.pagination;

  // Create search filter for user fields
  const searchFilter = createSearchFilter(search, ['name', 'email', 'phone']);

  // Build query filter (exclude admin users from this list)
  const queryFilter = {
    role: { $ne: 'admin' },
    ...searchFilter,
  };

  // Get total count for pagination
  const totalItems = await User.countDocuments(queryFilter);

  // Get paginated users
  const users = await User.find(queryFilter)
    .select(
      '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires'
    )
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const pagination = calculatePaginationMetadata(
    totalItems,
    req.pagination.page,
    req.pagination.pageSize
  );

  res.success(
    users,
    'Admin users list retrieved successfully',
    pagination
  );
});
