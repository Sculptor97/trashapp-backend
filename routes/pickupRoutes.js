import express from 'express';
import {
  createPickup,
  getPickups,
  getPickupById,
  updatePickup,
  deletePickup,
} from '../controllers/pickupController.js';
import { endpoints } from '../config/endpoints.js';

const router = express.Router();

// Customer pickup routes
router.post(endpoints.customer.pickups.request, createPickup);
router.get(endpoints.customer.pickups.my, getPickups);
router.get(endpoints.customer.pickups.detail(':id'), getPickupById);
router.put(endpoints.customer.pickups.detail(':id'), updatePickup);
router.delete(endpoints.customer.pickups.detail(':id'), deletePickup);

export default router;
