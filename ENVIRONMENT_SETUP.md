# Environment Setup Guide

## Local Development

For local development, create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/trashapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=1h

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Production Deployment

For production deployment on Render, set the following environment variables in your Render dashboard:

### Required Variables:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure secret for JWT tokens
- `JWT_EXPIRE` - JWT expiration time (e.g., "1h")
- `SESSION_SECRET` - A secure secret for sessions
- `FRONTEND_URL` - Your frontend URL
- `NODE_ENV` - Set to "production"

### Optional Variables:

- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## Notes

- The application will work without a `.env` file in production as long as environment variables are set in the deployment platform
- For local development, copy the example above to `.env` and update the values
- Never commit the actual `.env` file to version control
