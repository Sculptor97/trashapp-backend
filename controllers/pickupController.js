import asyncHandler from 'express-async-handler';
import Pickup from '../models/Pickup.js';
import RecurringPickupSchedule from '../models/RecurringPickupSchedule.js';
import {
  createSearchFilter,
  calculatePaginationMetadata,
} from '../middleware/paginationMiddleware.js';
import {
  isBefore,
  subWeeks,
  subMonths,
  subYears,
  addDays,
  addWeeks,
  addMonths,
  getDay,
  setDate,
  startOfDay,
} from 'date-fns';

// @desc    Create pickup request
// @route   POST /api/v1/customer/pickups/request
// @access  Private
export const createPickup = asyncHandler(async (req, res) => {
  const {
    address,
    coordinates,
    notes,
    pickup_date,
    pickup_time,
    waste_type,
    estimated_weight,
    urgent_pickup,
    recurring_pickup,
    recurring_frequency,
    special_instructions,
  } = req.body;

  // Validate pickup date is not in the past
  const pickupDate = new Date(pickup_date);
  const now = new Date();
  if (isBefore(pickupDate, startOfDay(now))) {
    return res.error(
      'Pickup date cannot be in the past',
      'INVALID_DATE',
      {},
      400
    );
  }

  // Create pickup data
  const pickupData = {
    user: req.user.userId,
    address,
    notes,
    pickup_date: pickupDate,
    pickup_time: pickup_time || 'morning',
    waste_type,
    estimated_weight: estimated_weight || 1,
    urgent_pickup: urgent_pickup || false,
    recurring_pickup: recurring_pickup || false,
    recurring_frequency,
    special_instructions,
  };

  // Add coordinates if provided
  if (coordinates && coordinates.length === 2) {
    pickupData.coordinates = {
      type: 'Point',
      coordinates: coordinates, // [longitude, latitude]
    };
  }

  // Create pickup
  const pickup = await Pickup.create(pickupData);

  // Populate user info
  await pickup.populate('user', 'name email phone');

  res.created(
    {
      id: pickup._id,
      pickup: pickup,
    },
    'Pickup request created successfully'
  );
});

// @desc    Get user's pickups
// @route   GET /api/v1/customer/pickups/my
// @access  Private
export const getPickups = asyncHandler(async (req, res) => {
  const { skip, limit, search } = req.pagination;
  const { status, waste_type, date_range, urgent_only, recurring_only } =
    req.query;

  // Build base query filter
  let queryFilter = {
    user: req.user.userId,
  };

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

  // Add recurring filter
  if (recurring_only === 'true') {
    queryFilter.recurring_pickup = true;
  }

  // Add date range filter
  if (date_range && date_range !== 'all') {
    const now = new Date();
    let startDate;

    switch (date_range) {
      case 'week':
        startDate = subWeeks(now, 1);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subYears(now, 1);
        break;
    }

    if (startDate) {
      queryFilter.createdAt = { $gte: startDate };
    }
  }

  // Get total count for pagination
  const totalItems = await Pickup.countDocuments(queryFilter);

  // Get paginated pickups
  const pickups = await Pickup.find(queryFilter)
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
    {
      pickups,
      pagination,
    },
    'Pickups retrieved successfully'
  );
});

// @desc    Get pickup by ID
// @route   GET /api/v1/customer/pickups/:id
// @access  Private
export const getPickupById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  })
    .populate('user', 'name email phone')
    .populate('assigned_driver', 'name phone')
    .populate('recurring_schedule');

  if (!pickup) {
    return res.notFound('Pickup');
  }

  res.success(pickup, 'Pickup details retrieved successfully');
});

// @desc    Update pickup
// @route   PUT /api/v1/customer/pickups/:id
// @access  Private
export const updatePickup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if pickup exists and belongs to user
  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  });

  if (!pickup) {
    return res.notFound('Pickup');
  }

  // Don't allow updates if pickup is completed or cancelled
  if (['completed', 'cancelled'].includes(pickup.status)) {
    return res.error(
      'Cannot update completed or cancelled pickup',
      'INVALID_STATUS',
      {},
      400
    );
  }

  // Handle coordinates update
  if (updateData.coordinates && updateData.coordinates.length === 2) {
    updateData.coordinates = {
      type: 'Point',
      coordinates: updateData.coordinates,
    };
  }

  // Update pickup
  const updatedPickup = await Pickup.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('user', 'name email phone')
    .populate('assigned_driver', 'name phone');

  res.success(updatedPickup, 'Pickup updated successfully');
});

// @desc    Cancel pickup
// @route   PATCH /api/v1/customer/pickups/:id/cancel
// @access  Private
export const cancelPickup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  });

  if (!pickup) {
    return res.notFound('Pickup');
  }

  // Don't allow cancellation if pickup is completed
  if (pickup.status === 'completed') {
    return res.error(
      'Cannot cancel completed pickup',
      'INVALID_STATUS',
      {},
      400
    );
  }

  // Update status to cancelled
  await pickup.addStatusUpdate('cancelled', 'Pickup cancelled by customer');

  res.success({}, 'Pickup cancelled successfully');
});

// @desc    Upload pickup photos
// @route   POST /api/v1/customer/pickups/:id/photos
// @access  Private
export const uploadPickupPhotos = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if pickup exists and belongs to user
  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  });

  if (!pickup) {
    return res.notFound('Pickup');
  }

  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.error('No photos uploaded', 'NO_PHOTOS', {}, 400);
  }

  // Extract photo URLs from Cloudinary response
  const photoUrls = req.files.map(file => file.path);

  // Update pickup with new photos
  pickup.photos = [...(pickup.photos || []), ...photoUrls];
  await pickup.save();

  res.success({ photo_urls: photoUrls }, 'Photos uploaded successfully');
});

// @desc    Get pickup statistics
// @route   GET /api/v1/customer/pickups/stats
// @access  Private
export const getPickupStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get pickup statistics
  const stats = await Pickup.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        total_requests: { $sum: 1 },
        pending_requests: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        scheduled_requests: {
          $sum: { $cond: [{ $eq: ['$status', 'assigned'] }, 1, 0] },
        },
        completed_requests: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        cancelled_requests: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
        },
        total_weight_collected: { $sum: '$actual_weight' },
        total_cost_saved: { $sum: '$actual_cost' },
        average_rating: { $avg: '$rating' },
      },
    },
  ]);

  const result = stats[0] || {
    total_requests: 0,
    pending_requests: 0,
    scheduled_requests: 0,
    completed_requests: 0,
    cancelled_requests: 0,
    total_weight_collected: 0,
    total_cost_saved: 0,
    average_rating: 0,
  };

  res.success(result, 'Pickup statistics retrieved successfully');
});

// @desc    Get pickup tracking
// @route   GET /api/v1/customer/pickups/:id/tracking
// @access  Private
export const getPickupTracking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  }).populate('assigned_driver', 'name phone');

  if (!pickup) {
    return res.notFound('Pickup');
  }

  const tracking = {
    pickup_id: pickup._id,
    driver_id: pickup.assigned_driver?._id,
    driver_name: pickup.assigned_driver?.name,
    driver_phone: pickup.assigned_driver?.phone,
    current_location:
      pickup.status_updates[pickup.status_updates.length - 1]?.location,
    estimated_arrival: pickup.pickup_date,
    status_updates: pickup.status_updates,
  };

  res.success(tracking, 'Pickup tracking retrieved successfully');
});

// @desc    Rate pickup
// @route   POST /api/v1/customer/pickups/:id/rate
// @access  Private
export const ratePickup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.error(
      'Rating must be between 1 and 5',
      'INVALID_RATING',
      {},
      400
    );
  }

  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  });

  if (!pickup) {
    return res.notFound('Pickup');
  }

  if (pickup.status !== 'completed') {
    return res.error(
      'Can only rate completed pickups',
      'INVALID_STATUS',
      {},
      400
    );
  }

  // Update pickup with rating and feedback
  pickup.rating = rating;
  pickup.feedback = feedback;
  await pickup.save();

  res.success({}, 'Pickup rated successfully');
});

// @desc    Contact driver
// @route   POST /api/v1/customer/pickups/:id/contact-driver
// @access  Private
export const contactDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.error('Message is required', 'MISSING_MESSAGE', {}, 400);
  }

  const pickup = await Pickup.findOne({
    _id: id,
    user: req.user.userId,
  }).populate('assigned_driver', 'name phone');

  if (!pickup) {
    return res.notFound('Pickup');
  }

  if (!pickup.assigned_driver) {
    return res.error('No driver assigned to this pickup', 'NO_DRIVER', {}, 400);
  }

  // TODO: Implement actual messaging system (SMS, push notification, etc.)
  // For now, just return success
  res.success(
    {
      driver_name: pickup.assigned_driver.name,
      driver_phone: pickup.assigned_driver.phone,
      message_sent: true,
    },
    'Message sent to driver successfully'
  );
});

// @desc    Create recurring pickup schedule
// @route   POST /api/v1/customer/pickups/recurring/create
// @access  Private
export const createRecurringSchedule = asyncHandler(async (req, res) => {
  const {
    frequency,
    day_of_week,
    day_of_month,
    time_slot,
    waste_type,
    address,
    coordinates,
    notes,
    special_instructions,
  } = req.body;

  // Calculate next pickup date
  const now = new Date();
  let nextPickupDate = new Date();

  if (frequency === 'weekly' || frequency === 'biweekly') {
    const currentDay = getDay(now);
    const daysUntilNext = day_of_week - currentDay;
    nextPickupDate = addDays(now, daysUntilNext);

    // If the calculated date is in the past, move to next week
    if (isBefore(nextPickupDate, now)) {
      nextPickupDate = addWeeks(nextPickupDate, 1);
    }
  } else if (frequency === 'monthly') {
    nextPickupDate = setDate(now, day_of_month);

    // If the calculated date is in the past, move to next month
    if (isBefore(nextPickupDate, now)) {
      nextPickupDate = addMonths(nextPickupDate, 1);
    }
  }

  const scheduleData = {
    user: req.user.userId,
    frequency,
    day_of_week,
    day_of_month,
    time_slot,
    waste_type,
    address,
    notes,
    special_instructions,
    next_pickup_date: nextPickupDate,
  };

  // Add coordinates if provided
  if (coordinates && coordinates.length === 2) {
    scheduleData.coordinates = {
      type: 'Point',
      coordinates: coordinates,
    };
  }

  const schedule = await RecurringPickupSchedule.create(scheduleData);

  res.created(schedule, 'Recurring pickup schedule created successfully');
});

// @desc    Get recurring pickup schedules
// @route   GET /api/v1/customer/pickups/recurring
// @access  Private
export const getRecurringSchedules = asyncHandler(async (req, res) => {
  const schedules = await RecurringPickupSchedule.find({
    user: req.user.userId,
  }).sort({ createdAt: -1 });

  res.success(schedules, 'Recurring schedules retrieved successfully');
});

// @desc    Toggle recurring schedule active status
// @route   PATCH /api/v1/customer/pickups/recurring/:id/toggle
// @access  Private
export const toggleRecurringSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const schedule = await RecurringPickupSchedule.findOne({
    _id: id,
    user: req.user.userId,
  });

  if (!schedule) {
    return res.notFound('Recurring schedule');
  }

  await schedule.toggleActive();

  res.success(schedule, 'Schedule status updated successfully');
});
