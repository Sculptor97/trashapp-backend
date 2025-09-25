# Pickup Service Implementation

This document describes the complete pickup service implementation for the trashapp backend, including all endpoints, models, and features.

## Overview

The pickup service provides comprehensive functionality for managing waste pickup requests, including:

- Creating and managing pickup requests
- Photo uploads with Cloudinary integration
- Recurring pickup schedules
- Real-time tracking and status updates
- Rating and feedback system
- Driver communication
- Statistics and analytics

## Models

### Pickup Model (`models/Pickup.js`)

The main pickup model with the following features:

**Fields:**

- `user`: Reference to User model
- `address`: Pickup address (required)
- `coordinates`: GeoJSON Point for location
- `notes`: Additional notes
- `status`: Enum ['pending', 'assigned', 'in_progress', 'completed', 'cancelled']
- `waste_type`: Enum ['general', 'recyclable', 'hazardous']
- `pickup_date`: Scheduled pickup date
- `pickup_time`: Enum ['morning', 'afternoon', 'evening']
- `estimated_weight`: Estimated weight in kg
- `actual_weight`: Actual weight after pickup
- `urgent_pickup`: Boolean flag
- `recurring_pickup`: Boolean flag
- `recurring_frequency`: Enum ['weekly', 'biweekly', 'monthly']
- `photos`: Array of Cloudinary URLs
- `special_instructions`: Special handling instructions
- `assigned_driver`: Reference to User model (driver)
- `estimated_cost`: Calculated cost in FCFA
- `actual_cost`: Final cost after pickup
- `completion_notes`: Driver notes
- `rating`: Customer rating (1-5)
- `feedback`: Customer feedback
- `status_updates`: Array of status change history

**Methods:**

- `calculateEstimatedCost()`: Calculates cost based on waste type and weight
- `addStatusUpdate()`: Adds status change with timestamp and location
- `toJSON()`: Transforms output for frontend compatibility

**Indexes:**

- User, status, pickup_date, waste_type, assigned_driver
- Geospatial index on coordinates

### RecurringPickupSchedule Model (`models/RecurringPickupSchedule.js`)

Manages recurring pickup schedules:

**Fields:**

- `user`: Reference to User model
- `frequency`: Enum ['weekly', 'biweekly', 'monthly']
- `day_of_week`: 0-6 (Sunday = 0)
- `day_of_month`: 1-31
- `time_slot`: Enum ['morning', 'afternoon', 'evening']
- `waste_type`: Enum ['general', 'recyclable', 'hazardous']
- `address`: Pickup address
- `coordinates`: GeoJSON Point
- `is_active`: Boolean status
- `next_pickup_date`: Next scheduled pickup

**Methods:**

- `calculateNextPickupDate()`: Calculates next pickup date
- `toggleActive()`: Toggles active status

## Cloudinary Integration

### Configuration (`config/cloudinary.js`)

**Features:**

- Automatic image optimization and resizing
- Multiple file format support (jpg, jpeg, png, gif, webp)
- 5MB file size limit
- Maximum 5 files per upload
- Organized folder structure (`trashapp/pickups/`)

**Helper Functions:**

- `deleteImage()`: Delete single image
- `deleteImages()`: Delete multiple images
- `extractPublicId()`: Extract public ID from URL

## API Endpoints

### Customer Pickup Endpoints

#### 1. Create Pickup Request

```
POST /api/v1/customer/pickups/request
```

**Request Body:**

```json
{
  "address": "123 Main St, City",
  "coordinates": [longitude, latitude],
  "notes": "Optional notes",
  "pickup_date": "2024-01-15T10:00:00Z",
  "pickup_time": "morning",
  "waste_type": "general",
  "estimated_weight": 10,
  "urgent_pickup": false,
  "recurring_pickup": false,
  "recurring_frequency": "weekly",
  "special_instructions": "Handle with care"
}
```

**Response:**

```json
{
  "data": {
    "id": "pickup_id",
    "pickup": {
      /* pickup object */
    }
  },
  "message": "Pickup request created successfully",
  "status_code": "201"
}
```

#### 2. Get User's Pickups (with pagination and filters)

```
GET /api/v1/customer/pickups/my?page=1&page_size=10&search=keyword&status=pending&waste_type=general&date_range=week&urgent_only=true&recurring_only=false
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)
- `search`: Search in address, notes, special_instructions
- `status`: Filter by status ['pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'all']
- `waste_type`: Filter by waste type ['general', 'recyclable', 'hazardous', 'all']
- `date_range`: Filter by date range ['week', 'month', 'year', 'all']
- `urgent_only`: Show only urgent pickups (true/false)
- `recurring_only`: Show only recurring pickups (true/false)

**Response:**

```json
{
  "data": {
    "pickups": [
      /* array of pickup objects */
    ],
    "pagination": {
      "current_page": 1,
      "page_size": 10,
      "total_items": 25,
      "total_pages": 3,
      "has_next_page": true,
      "has_previous_page": false,
      "next_page": 2,
      "previous_page": null
    }
  },
  "message": "Pickups retrieved successfully",
  "status_code": "200"
}
```

#### 3. Get Pickup by ID

```
GET /api/v1/customer/pickups/:id
```

#### 4. Update Pickup

```
PUT /api/v1/customer/pickups/:id
```

#### 5. Cancel Pickup

```
PATCH /api/v1/customer/pickups/:id/cancel
```

#### 6. Upload Photos

```
POST /api/v1/customer/pickups/:id/photos
Content-Type: multipart/form-data
```

**Request:** Form data with multiple photo files

**Response:**

```json
{
  "data": {
    "photo_urls": ["https://cloudinary.com/url1", "https://cloudinary.com/url2"]
  },
  "message": "Photos uploaded successfully",
  "status_code": "200"
}
```

#### 7. Get Pickup Statistics

```
GET /api/v1/customer/pickups/stats
```

**Response:**

```json
{
  "data": {
    "total_requests": 50,
    "pending_requests": 5,
    "scheduled_requests": 10,
    "completed_requests": 30,
    "cancelled_requests": 5,
    "total_weight_collected": 500,
    "total_cost_saved": 25000,
    "average_rating": 4.5
  },
  "message": "Pickup statistics retrieved successfully",
  "status_code": "200"
}
```

#### 8. Get Pickup Tracking

```
GET /api/v1/customer/pickups/:id/tracking
```

**Response:**

```json
{
  "data": {
    "pickup_id": "pickup_id",
    "driver_id": "driver_id",
    "driver_name": "John Doe",
    "driver_phone": "+1234567890",
    "current_location": {
      "type": "Point",
      "coordinates": [longitude, latitude],
      "address": "Current location"
    },
    "estimated_arrival": "2024-01-15T10:00:00Z",
    "status_updates": [/* array of status updates */]
  },
  "message": "Pickup tracking retrieved successfully",
  "status_code": "200"
}
```

#### 9. Rate Pickup

```
POST /api/v1/customer/pickups/:id/rate
```

**Request Body:**

```json
{
  "rating": 5,
  "feedback": "Excellent service!"
}
```

#### 10. Contact Driver

```
POST /api/v1/customer/pickups/:id/contact-driver
```

**Request Body:**

```json
{
  "message": "Please call when you arrive"
}
```

### Recurring Pickup Endpoints

#### 1. Create Recurring Schedule

```
POST /api/v1/customer/pickups/recurring/create
```

**Request Body:**

```json
{
  "frequency": "weekly",
  "day_of_week": 1,
  "time_slot": "morning",
  "waste_type": "general",
  "address": "123 Main St, City",
  "coordinates": [longitude, latitude],
  "notes": "Weekly pickup",
  "special_instructions": "Ring doorbell"
}
```

#### 2. Get Recurring Schedules

```
GET /api/v1/customer/pickups/recurring
```

#### 3. Toggle Schedule Status

```
PATCH /api/v1/customer/pickups/recurring/:id/toggle
```

### Admin Endpoints

#### 1. Get All Pickups (Admin)

```
GET /api/v1/admin/pickups?page=1&page_size=20&search=keyword&status=pending&waste_type=general&urgent_only=true
```

**Features:**

- Pagination support
- Search functionality
- Status and waste type filtering
- Urgent pickup filtering
- Populated user and driver information

## Authentication & Authorization

All pickup endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Error Handling

The service includes comprehensive error handling for:

- Invalid pickup dates (past dates)
- Missing required fields
- Invalid status transitions
- File upload errors
- Database validation errors
- Authentication failures

## Cost Calculation

The system automatically calculates pickup costs based on:

- **Base costs per kg:**
  - General waste: 1000 FCFA/kg
  - Recyclable: 800 FCFA/kg
  - Hazardous: 2000 FCFA/kg
- **Urgent pickup surcharge:** 50% additional cost
- **Formula:** `(base_cost * weight) * (urgent ? 1.5 : 1)`

## Status Flow

Pickup status follows this flow:

1. `pending` → Initial state
2. `assigned` → Driver assigned
3. `in_progress` → Driver en route/collecting
4. `completed` → Pickup finished
5. `cancelled` → Can be cancelled from any state except completed

## Environment Variables Required

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Usage Examples

### Creating a Pickup Request

```javascript
const response = await fetch('/api/v1/customer/pickups/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({
    address: '123 Main St, Douala',
    coordinates: [9.7, 4.05],
    pickup_date: '2024-01-15T10:00:00Z',
    waste_type: 'general',
    estimated_weight: 15,
    urgent_pickup: false,
  }),
});
```

### Uploading Photos

```javascript
const formData = new FormData();
formData.append('photos', photoFile1);
formData.append('photos', photoFile2);

const response = await fetch('/api/v1/customer/pickups/pickup_id/photos', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
  },
  body: formData,
});
```

## Performance Considerations

- **Database Indexes:** Optimized for common queries
- **Pagination:** Prevents large dataset issues
- **Image Optimization:** Cloudinary handles compression and format conversion
- **Geospatial Queries:** Efficient location-based searches
- **Aggregation Pipelines:** Optimized statistics calculations

## Future Enhancements

- Real-time notifications via WebSocket
- SMS integration for driver communication
- Advanced analytics and reporting
- Integration with payment systems
- Mobile app push notifications
- Route optimization for drivers
