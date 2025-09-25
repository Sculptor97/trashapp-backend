import express from 'express';
import {
  getAdminDashboard,
  getAdminPickups,
  getAdminDrivers,
  getAdminUsers,
} from '../controllers/adminController.js';
import { paginationMiddleware } from '../middleware/paginationMiddleware.js';
import { endpoints } from '../config/endpoints.js';

const router = express.Router();

// Admin routes
router.get(endpoints.admin.dashboard.stats, getAdminDashboard);
router.get(endpoints.admin.pickups.all, paginationMiddleware, getAdminPickups);
router.get(endpoints.admin.drivers.all, paginationMiddleware, getAdminDrivers);
router.get(endpoints.admin.users.all, paginationMiddleware, getAdminUsers);

export default router;
