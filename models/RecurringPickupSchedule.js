import mongoose from 'mongoose';
import { addWeeks, addMonths } from 'date-fns';

const recurringPickupScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      required: [true, 'Frequency is required'],
    },
    day_of_week: {
      type: Number,
      min: [0, 'Day of week must be between 0-6'],
      max: [6, 'Day of week must be between 0-6'],
      validate: {
        validator: function (value) {
          // Only required for weekly and biweekly
          if (['weekly', 'biweekly'].includes(this.frequency)) {
            return value !== undefined && value !== null;
          }
          return true;
        },
        message: 'Day of week is required for weekly and biweekly schedules',
      },
    },
    day_of_month: {
      type: Number,
      min: [1, 'Day of month must be between 1-31'],
      max: [31, 'Day of month must be between 1-31'],
      validate: {
        validator: function (value) {
          // Only required for monthly
          if (this.frequency === 'monthly') {
            return value !== undefined && value !== null;
          }
          return true;
        },
        message: 'Day of month is required for monthly schedules',
      },
    },
    time_slot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      required: [true, 'Time slot is required'],
    },
    waste_type: {
      type: String,
      enum: ['general', 'recyclable', 'hazardous'],
      required: [true, 'Waste type is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    next_pickup_date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    special_instructions: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
recurringPickupScheduleSchema.index({ user: 1 });
recurringPickupScheduleSchema.index({ is_active: 1 });
recurringPickupScheduleSchema.index({ next_pickup_date: 1 });
recurringPickupScheduleSchema.index({ coordinates: '2dsphere' }); // Geospatial index

// Method to calculate next pickup date
recurringPickupScheduleSchema.methods.calculateNextPickupDate = function () {
  const now = new Date();
  let nextDate = new Date(this.next_pickup_date || now);

  switch (this.frequency) {
    case 'weekly':
      nextDate = addWeeks(nextDate, 1);
      break;
    case 'biweekly':
      nextDate = addWeeks(nextDate, 2);
      break;
    case 'monthly':
      nextDate = addMonths(nextDate, 1);
      break;
  }

  return nextDate;
};

// Method to toggle active status
recurringPickupScheduleSchema.methods.toggleActive = function () {
  this.is_active = !this.is_active;
  return this.save();
};

// Transform output
recurringPickupScheduleSchema.methods.toJSON = function () {
  const scheduleObject = this.toObject();

  // Convert coordinates to [longitude, latitude] format for frontend
  if (scheduleObject.coordinates && scheduleObject.coordinates.coordinates) {
    scheduleObject.coordinates = scheduleObject.coordinates.coordinates;
  }

  return scheduleObject;
};

export default mongoose.model(
  'RecurringPickupSchedule',
  recurringPickupScheduleSchema
);
