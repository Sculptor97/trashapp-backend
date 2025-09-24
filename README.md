# TrashApp Backend

Backend API for the TrashApp waste management application.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Refresh token support
  - Email verification
  - Password reset functionality
  - Google OAuth integration (ready for implementation)

- 📦 **Pickup Management**
  - Request pickup services
  - Track pickup status
  - Rate and review services

- 👑 **Admin Dashboard**
  - Manage users and drivers
  - Monitor pickup requests
  - Analytics and reporting

- 🛡️ **Security**
  - Password hashing with bcrypt
  - Account lockout protection
  - Input validation
  - CORS configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Express Async Handler
- **Code Quality**: ESLint + Prettier

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd trashapp/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Environment Variables

See `.env.example` for all required environment variables.

**Required:**

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

## API Documentation

### Base URL

- Development: `http://localhost:5000/api/v1`
- Production: `https://your-domain.com/api/v1`

### Authentication Endpoints

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | `/auth/register`       | Register new user      |
| POST   | `/auth/login`          | User login             |
| POST   | `/auth/logout`         | User logout            |
| GET    | `/auth/profile`        | Get user profile       |
| POST   | `/auth/token/refresh`  | Refresh access token   |
| POST   | `/auth/email/verify`   | Verify email address   |
| POST   | `/auth/password/reset` | Request password reset |

### Customer Endpoints

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| POST   | `/customer/pickups/request` | Request pickup     |
| GET    | `/customer/pickups/my`      | Get user's pickups |
| GET    | `/customer/pickups/:id`     | Get pickup details |

### Admin Endpoints

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| GET    | `/admin/dashboard/stats` | Dashboard statistics |
| GET    | `/admin/pickups`         | All pickups          |
| GET    | `/admin/drivers`         | All drivers          |
| GET    | `/admin/users`           | All users            |

### Health Check

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Server health status |

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "data": {
    /* response data */
  },
  "message": "Success message",
  "status_code": "200"
}
```

### Error Response

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {
      /* additional details */
    }
  },
  "status_code": "400"
}
```

### Paginated Response

```json
{
  "data": {
    /* response data */
  },
  "message": "Success message",
  "status_code": "200",
  "pagination": {
    "current_page": 1,
    "count": 100,
    "total_pages": 10
  }
}
```

## Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
npm run format:check # Check code formatting
```

### Code Quality

- **ESLint**: Code linting and style checking
- **Prettier**: Code formatting
- **Async/Await**: Modern async handling
- **Error Handling**: Centralized error management

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Push code to Git repository
2. Connect repository to Render
3. Set environment variables
4. Deploy!

## Database Schema

### User Model

- Basic info (name, email, password)
- Role-based access (customer, driver, admin)
- Email verification
- Google OAuth integration
- Address and contact info

### RefreshToken Model

- Token management
- Device tracking
- Automatic expiration

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Account lockout protection
- Input validation
- CORS configuration
- Rate limiting (ready for implementation)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Support

For questions and support, please open an issue in the repository.
