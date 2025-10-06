import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { endpoints } from './config/endpoints.js';
import {
  responseMiddleware,
  errorHandler,
  notFoundHandler,
} from './middleware/responseMiddleware.js';

connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:3001',
      'https://localhost:5173',
      'https://localhost:3001',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(responseMiddleware);

// API routes using centralized endpoints
app.use(`${endpoints.api.v1}/auth`, authRoutes);
app.use(`${endpoints.api.v1}/customer`, pickupRoutes);
app.use(`${endpoints.api.v1}/admin`, adminRoutes);
app.use(`${endpoints.api.v1}/portfolio`, portfolioRoutes);
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
