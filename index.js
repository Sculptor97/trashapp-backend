import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { endpoints } from './config/endpoints.js';
import {
  responseMiddleware,
  errorHandler,
  notFoundHandler,
} from './middleware/responseMiddleware.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(responseMiddleware);

// API routes using centralized endpoints
app.use(`${endpoints.api.v1}/auth`, authRoutes);
app.use(`${endpoints.api.v1}/pickups`, pickupRoutes);
app.use(`${endpoints.api.v1}/admin`, adminRoutes);

// Health check endpoint
app.get(endpoints.health, (req, res) => {
  res.success(
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    'Server is healthy'
  );
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
