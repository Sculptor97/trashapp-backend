import express from 'express';
import {
  getAdminDashboard,
  getAdminPickups,
  getAdminDrivers,
  getAdminUsers,
} from '../controllers/adminController.js';
import { endpoints } from '../config/endpoints.js';

const router = express.Router();

// Admin routes
router.get(endpoints.admin.dashboard.stats, getAdminDashboard);
router.get(endpoints.admin.pickups.all, getAdminPickups);
router.get(endpoints.admin.drivers.all, getAdminDrivers);
router.get(endpoints.admin.users.all, getAdminUsers);

export default router;
