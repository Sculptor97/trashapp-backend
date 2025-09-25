import express from 'express';
import {
  createPickup,
  getPickups,
  getPickupById,
  updatePickup,
  cancelPickup,
  uploadPickupPhotos,
  getPickupStats,
  getPickupTracking,
  ratePickup,
  contactDriver,
  createRecurringSchedule,
  getRecurringSchedules,
  toggleRecurringSchedule,
} from '../controllers/pickupController.js';
import { paginationMiddleware } from '../middleware/paginationMiddleware.js';
import { upload } from '../config/cloudinary.js';
import { endpoints } from '../config/endpoints.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Customer pickup routes
router.post(endpoints.customer.pickups.request, createPickup);
router.get(endpoints.customer.pickups.my, paginationMiddleware, getPickups);
router.get(endpoints.customer.pickups.detail, getPickupById);
router.put(endpoints.customer.pickups.detail, updatePickup);
router.patch(endpoints.customer.pickups.cancel, cancelPickup);
router.post(
  endpoints.customer.pickups.photos,
  upload.array('photos', 5),
  uploadPickupPhotos
);
router.get(endpoints.customer.pickups.stats, getPickupStats);
router.get(endpoints.customer.pickups.tracking, getPickupTracking);
router.post(endpoints.customer.pickups.rate, ratePickup);
router.post(endpoints.customer.pickups.contactDriver, contactDriver);

// Recurring pickup routes
router.post(
  endpoints.customer.pickups.recurring.create,
  createRecurringSchedule
);
router.get(endpoints.customer.pickups.recurring.all, getRecurringSchedules);
router.patch(
  endpoints.customer.pickups.recurring.toggle,
  toggleRecurringSchedule
);

export default router;
