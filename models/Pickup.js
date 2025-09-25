import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    waste_type: {
      type: String,
      enum: ['general', 'recyclable', 'hazardous'],
      required: [true, 'Waste type is required'],
    },
    pickup_date: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    pickup_time: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning',
    },
    estimated_weight: {
      type: Number,
      min: [0, 'Weight must be positive'],
    },
    actual_weight: {
      type: Number,
      min: [0, 'Weight must be positive'],
    },
    urgent_pickup: {
      type: Boolean,
      default: false,
    },
    recurring_pickup: {
      type: Boolean,
      default: false,
    },
    recurring_frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
    },
    photos: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    special_instructions: {
      type: String,
      trim: true,
    },
    assigned_driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    estimated_cost: {
      type: Number,
      min: [0, 'Cost must be positive'],
    },
    actual_cost: {
      type: Number,
      min: [0, 'Cost must be positive'],
    },
    completion_notes: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    feedback: {
      type: String,
      trim: true,
    },
    recurring_schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecurringPickupSchedule',
    },
    status_updates: [
      {
        status: {
          type: String,
          enum: [
            'pending',
            'assigned',
            'in_progress',
            'completed',
            'cancelled',
          ],
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        location: {
          type: {
            type: String,
            enum: ['Point'],
          },
          coordinates: [Number],
          address: String,
        },
        photos: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
pickupSchema.index({ user: 1 });
pickupSchema.index({ status: 1 });
pickupSchema.index({ pickup_date: 1 });
pickupSchema.index({ waste_type: 1 });
pickupSchema.index({ assigned_driver: 1 });
pickupSchema.index({ coordinates: '2dsphere' }); // Geospatial index

// Virtual for driver info
pickupSchema.virtual('driver_name', {
  ref: 'User',
  localField: 'assigned_driver',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name' },
});

pickupSchema.virtual('driver_phone', {
  ref: 'User',
  localField: 'assigned_driver',
  foreignField: '_id',
  justOne: true,
  options: { select: 'phone' },
});

// Method to calculate estimated cost
pickupSchema.methods.calculateEstimatedCost = function () {
  const baseCosts = {
    general: 1000, // FCFA per kg
    recyclable: 800,
    hazardous: 2000,
  };

  const baseCost = baseCosts[this.waste_type] || baseCosts.general;
  let cost = baseCost * (this.estimated_weight || 1);

  if (this.urgent_pickup) {
    cost *= 1.5; // 50% surcharge for urgent pickup
  }

  return Math.round(cost);
};

// Method to add status update
pickupSchema.methods.addStatusUpdate = function (
  status,
  message,
  location = null,
  photos = []
) {
  this.status_updates.push({
    status,
    message,
    location,
    photos,
  });
  this.status = status;
  return this.save();
};

// Pre-save middleware to calculate estimated cost
pickupSchema.pre('save', function (next) {
  if (
    this.isModified('waste_type') ||
    this.isModified('estimated_weight') ||
    this.isModified('urgent_pickup')
  ) {
    this.estimated_cost = this.calculateEstimatedCost();
  }
  next();
});

// Transform output
pickupSchema.methods.toJSON = function () {
  const pickupObject = this.toObject();

  // Convert coordinates to [longitude, latitude] format for frontend
  if (pickupObject.coordinates && pickupObject.coordinates.coordinates) {
    pickupObject.coordinates = pickupObject.coordinates.coordinates;
  }

  // Add driver info if populated
  if (
    pickupObject.assigned_driver &&
    typeof pickupObject.assigned_driver === 'object'
  ) {
    pickupObject.driver_name = pickupObject.assigned_driver.name;
    pickupObject.driver_phone = pickupObject.assigned_driver.phone;
  }

  return pickupObject;
};

export default mongoose.model('Pickup', pickupSchema);
