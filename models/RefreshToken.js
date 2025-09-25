import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
// Note: token already has a unique index from schema definition
refreshTokenSchema.index({ user: 1 });
// Note: expiresAt already has a TTL index defined in the schema field

// Static method to create refresh token
refreshTokenSchema.statics.createToken = function (userId, deviceInfo = {}) {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return this.create({
    token,
    user: userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    deviceInfo,
  });
};

// Static method to find valid token
refreshTokenSchema.statics.findValidToken = function (token) {
  return this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).populate('user');
};

// Method to revoke token
refreshTokenSchema.methods.revoke = function () {
  this.isRevoked = true;
  return this.save();
};

// Method to check if token is valid
refreshTokenSchema.methods.isValid = function () {
  return !this.isRevoked && this.expiresAt > new Date();
};

export default mongoose.model('RefreshToken', refreshTokenSchema);
