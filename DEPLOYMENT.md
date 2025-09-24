# TrashApp Backend - Deployment Guide

This guide will help you deploy the TrashApp backend to Render.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com))
- A MongoDB database (MongoDB Atlas recommended)
- Environment variables configured

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist Render's IP addresses (0.0.0.0/0 for all IPs)

#### Option B: Render PostgreSQL (Alternative)

- Render also offers managed PostgreSQL databases
- You would need to modify the connection logic

### 3. Deploy to Render

#### Method 1: Using render.yaml (Recommended)

1. Push your code with the `render.yaml` file
2. Connect your repository to Render
3. Render will automatically detect the configuration

#### Method 2: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure the service:
   - **Name**: `trashapp-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

### 4. Environment Variables

Set these environment variables in the Render dashboard:

#### Required Variables:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trashapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=1h
FRONTEND_URL=https://your-frontend-domain.com
```

#### Optional Variables:

```
EMAIL_FROM=noreply@trashapp.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.onrender.com/api/v1/auth/google/callback
```

### 5. Domain Configuration

1. Render will provide a default domain: `https://trashapp-backend.onrender.com`
2. You can add a custom domain in the Render dashboard
3. Update your frontend to use the new backend URL

### 6. Health Check

Your backend includes a health check endpoint at `/health` that returns:

```json
{
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  },
  "message": "Server is healthy",
  "status_code": "200"
}
```

### 7. API Endpoints

Once deployed, your API will be available at:

- Base URL: `https://your-backend-domain.onrender.com/api/v1`
- Health Check: `https://your-backend-domain.onrender.com/health`
- Auth Endpoints: `https://your-backend-domain.onrender.com/api/v1/auth/*`
- Customer Endpoints: `https://your-backend-domain.onrender.com/api/v1/customer/*`
- Admin Endpoints: `https://your-backend-domain.onrender.com/api/v1/admin/*`

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Environment Variables**
   - Double-check all required variables are set
   - Ensure no typos in variable names
   - Verify JWT_SECRET is strong and unique

4. **Health Check Failures**
   - Verify the `/health` endpoint is accessible
   - Check server logs for errors
   - Ensure the application starts successfully

### Logs and Monitoring

- View logs in the Render dashboard
- Monitor performance and errors
- Set up alerts for downtime

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Enable IP whitelisting
   - Use SSL connections

3. **CORS Configuration**
   - Update CORS settings for production domains
   - Remove development URLs

## Scaling

- Start with the free tier
- Upgrade to paid plans for better performance
- Consider database scaling for high traffic
- Monitor resource usage

## Support

- Render Documentation: [render.com/docs](https://render.com/docs)
- MongoDB Atlas Documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Node.js Best Practices: [github.com/goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)
