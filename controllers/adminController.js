import asyncHandler from 'express-async-handler';

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
  // TODO: Implement admin pickups list
  res.success(
    {
      pickups: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    'Admin pickups list retrieved successfully'
  );
});

// @desc    Get all drivers for admin
// @route   GET /api/v1/admin/drivers
// @access  Private (Admin only)
export const getAdminDrivers = asyncHandler(async (req, res) => {
  // TODO: Implement admin drivers list
  res.success(
    {
      drivers: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    'Admin drivers list retrieved successfully'
  );
});

// @desc    Get all users for admin
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
export const getAdminUsers = asyncHandler(async (req, res) => {
  // TODO: Implement admin users list
  res.success(
    {
      users: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    'Admin users list retrieved successfully'
  );
});
