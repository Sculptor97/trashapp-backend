# Pagination Implementation

This document describes the pagination system implemented across all list endpoints in the backend.

## Overview

The pagination system provides consistent pagination across all list endpoints with the following features:

- Standardized query parameters
- Search functionality
- Consistent response format
- Modular middleware approach

## Query Parameters

All list endpoints accept the following query parameters:

| Parameter   | Type   | Default | Description                |
| ----------- | ------ | ------- | -------------------------- |
| `page`      | number | 1       | Page number (must be >= 1) |
| `page_size` | number | 10      | Items per page (1-100)     |
| `search`    | string | null    | Search term for filtering  |

## Example Requests

```bash
# Basic pagination
GET /api/v1/admin/users?page=2&page_size=20

# With search
GET /api/v1/admin/drivers?search=john&page=1&page_size=15

# Default values
GET /api/v1/customer/pickups/my
```

## Response Format

All paginated responses follow this structure:

```json
{
  "data": {
    "users": [...], // or "drivers", "pickups", etc.
    "pagination": {
      "current_page": 2,
      "page_size": 20,
      "total_items": 150,
      "total_pages": 8,
      "has_next_page": true,
      "has_previous_page": true,
      "next_page": 3,
      "previous_page": 1
    }
  },
  "message": "Admin users list retrieved successfully",
  "status_code": "200"
}
```

## Implementation Details

### Middleware

The `paginationMiddleware` is applied to all list endpoints and:

- Parses query parameters
- Validates input values
- Calculates skip/limit values
- Attaches pagination info to `req.pagination`

### Controller Usage

Controllers use the pagination middleware like this:

```javascript
export const getAdminUsers = asyncHandler(async (req, res) => {
  const { skip, limit, search } = req.pagination;

  // Create search filter
  const searchFilter = createSearchFilter(search, ['name', 'email', 'phone']);

  // Build query
  const queryFilter = {
    role: { $ne: 'admin' },
    ...searchFilter,
  };

  // Get total count
  const totalItems = await User.countDocuments(queryFilter);

  // Get paginated results
  const users = await User.find(queryFilter)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Calculate pagination metadata
  const pagination = calculatePaginationMetadata(
    totalItems,
    req.pagination.page,
    req.pagination.pageSize
  );

  // Return response
  res.success(
    {
      users,
      pagination,
    },
    'Admin users list retrieved successfully'
  );
});
```

## List Endpoints with Pagination

### Admin Endpoints

- `GET /api/v1/admin/pickups` - List all pickups
- `GET /api/v1/admin/drivers` - List all drivers
- `GET /api/v1/admin/users` - List all users

### Customer Endpoints

- `GET /api/v1/customer/pickups/my` - Get user's pickups

## Search Functionality

Search is implemented using MongoDB regex queries on relevant fields:

- **Users/Drivers**: `name`, `email`, `phone`
- **Pickups**: Will be implemented when Pickup model is created

## Adding Pagination to New Endpoints

To add pagination to a new list endpoint:

1. **Add middleware to route**:

```javascript
router.get('/new-endpoint', paginationMiddleware, controllerFunction);
```

2. **Use in controller**:

```javascript
export const getNewList = asyncHandler(async (req, res) => {
  const { skip, limit, search } = req.pagination;

  // Create search filter for relevant fields
  const searchFilter = createSearchFilter(search, ['field1', 'field2']);

  // Build query
  const queryFilter = {
    // your filters
    ...searchFilter,
  };

  // Get total count
  const totalItems = await Model.countDocuments(queryFilter);

  // Get paginated results
  const items = await Model.find(queryFilter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Calculate pagination metadata
  const pagination = calculatePaginationMetadata(
    totalItems,
    req.pagination.page,
    req.pagination.pageSize
  );

  // Return response
  res.success(
    {
      items, // or specific name like "users", "drivers", etc.
      pagination,
    },
    'Items retrieved successfully'
  );
});
```

## Error Handling

The pagination middleware validates:

- `page` must be >= 1
- `page_size` must be between 1 and 100

Invalid values return appropriate error responses.

## Performance Considerations

- Use database indexes on searchable fields
- Consider implementing cursor-based pagination for very large datasets
- Monitor query performance with large page sizes
