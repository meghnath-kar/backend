# User Service

Microservice for user authentication, registration, and user management.

## Features

- ✅ User Registration
- ✅ User Login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ User profile management
- ✅ Password change functionality
- ✅ User CRUD operations (admin only)
- ✅ User statistics and analytics
- ✅ Role-based access control
- ✅ Authentication middleware
- ✅ Input validation

## Tech Stack

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment variables

## Project Structure

```
user-service/
├── controllers/
│   ├── AuthController.js      # Authentication controller
│   └── UserController.js       # User management controller
├── database/
│   └── connection.js           # MongoDB connection
├── middleware/
│   ├── authMiddleware.js       # JWT authentication middleware
│   └── adminMiddleware.js      # Admin role verification
├── models/
│   └── User.js                 # User model with validation
├── routes/
│   ├── authRoutes.js           # Authentication routes
│   └── userRoutes.js           # User management routes
├── services/
│   ├── AuthService.js          # Authentication business logic
│   └── UserService.js          # User management business logic
├── .env                        # Environment variables
├── package.json                # Dependencies
├── server.js                   # Entry point
└── README.md                   # This file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017
DB_NAME=course_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

3. Start the service:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Endpoints (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "country": "USA",
  "age": 25,
  "password": "password123",
  "role": "user"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "country": "USA",
    "age": 25,
    "role": "user",
    "is_active": true
  }
}
```

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Smith",
  "country": "Canada",
  "age": 26
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

#### Change Password (Protected)
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Logout
```http
POST /api/auth/logout

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

### User Management Endpoints (`/api/users`) - Admin Only

#### Get All Users
```http
GET /api/users?page=1&limit=10&email=john&country=USA
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

#### Get User Statistics
```http
GET /api/users/stats
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "activeUsers": 85,
    "inactiveUsers": 15,
    "usersByRole": [...],
    "usersByCountry": [...],
    "recentUsers": [...]
  }
}
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "is_active": true
}

Response: 200 OK
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

#### Toggle User Status
```http
PATCH /api/users/:id/toggle-status
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "User status updated successfully",
  "data": { ... }
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "User deleted successfully",
  "data": { ... }
}
```

## User Model

```javascript
{
  fullName: String (required, 2-100 chars),
  email: String (required, unique, valid email),
  country: String (required),
  age: Number (required, min: 18, max: 120),
  password: String (required, min: 6 chars, auto-hashed),
  is_active: Boolean (default: true),
  role: String (enum: ['user', 'admin', 'instructor'], default: 'user'),
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Authentication Flow

1. **Registration**: User provides details → Password is hashed → User saved to DB → JWT token generated
2. **Login**: User provides email/password → Credentials verified → JWT token generated → Last login updated
3. **Protected Routes**: Client sends JWT token in Authorization header → Middleware verifies token → Request proceeds

## Middleware

### authMiddleware
- Verifies JWT token from Authorization header
- Attaches user info to `req.user`
- Returns 401 if token is invalid or missing

### adminMiddleware
- Checks if authenticated user has admin role
- Returns 403 if user is not admin
- Must be used after authMiddleware

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token-based authentication
- ✅ Password not returned in API responses
- ✅ Role-based access control
- ✅ Email validation
- ✅ Age validation (minimum 18)
- ✅ Token expiration handling
- ✅ Input validation

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Testing

### Test Registration
```bash
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "country": "USA",
    "age": 25,
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5003/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Health Check

```http
GET /health

Response: 200 OK
{
  "status": "User Service is running"
}
```

## Future Enhancements

- [ ] Email verification
- [ ] Forgot password functionality
- [ ] Refresh tokens
- [ ] OAuth integration (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Rate limiting
- [ ] Token blacklisting for logout
- [ ] Password strength validation
- [ ] Account lockout after failed attempts
- [ ] User activity logging

## Contributing

1. Follow the existing code structure
2. Use async/await for asynchronous operations
3. Add proper error handling
4. Update documentation for new features
5. Test all endpoints before committing

## License

ISC
