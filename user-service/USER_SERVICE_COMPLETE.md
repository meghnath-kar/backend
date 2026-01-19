# User Service - Complete Setup

## Overview
A complete user authentication and management microservice has been successfully created following the course-search-service structure. The service provides full user registration, login, and management capabilities with JWT authentication.

## Created Files (16 files)

### Core Files
1. ✅ **server.js** - Express server with middleware and route configuration
2. ✅ **package.json** - Dependencies including jsonwebtoken for JWT authentication
3. ✅ **.env** - Environment configuration (PORT, MongoDB, JWT settings)
4. ✅ **.gitignore** - Git ignore patterns
5. ✅ **README.md** - Comprehensive documentation

### Database
6. ✅ **database/connection.js** - MongoDB connection utility

### Models
7. ✅ **models/User.js** - User schema with validation, password hashing, and methods

### Controllers
8. ✅ **controllers/AuthController.js** - Authentication endpoints handler
9. ✅ **controllers/UserController.js** - User management endpoints handler

### Services (Business Logic)
10. ✅ **services/AuthService.js** - Registration, login, JWT generation, password management
11. ✅ **services/UserService.js** - User CRUD operations, statistics, search

### Routes
12. ✅ **routes/authRoutes.js** - Authentication routes (/api/auth/*)
13. ✅ **routes/userRoutes.js** - User management routes (/api/users/*)

### Middleware
14. ✅ **middleware/authMiddleware.js** - JWT token verification
15. ✅ **middleware/adminMiddleware.js** - Admin role verification

## Architecture Pattern

The service follows a clean layered architecture:

```
Request → Routes → Controller → Service → Model → Database
                                    ↓
                                Response
```

**Middleware** intercepts requests before reaching controllers for:
- JWT authentication
- Role-based authorization

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login user |
| POST | `/logout` | ❌ | Logout user |
| GET | `/profile` | ✅ | Get user profile |
| PUT | `/profile` | ✅ | Update profile |
| POST | `/change-password` | ✅ | Change password |
| GET | `/verify/:token` | ❌ | Verify account |

### User Management Routes (`/api/users`) - Admin Only

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ Admin | Get all users (with filters) |
| GET | `/stats` | ✅ Admin | Get user statistics |
| GET | `/:id` | ✅ Admin | Get user by ID |
| PUT | `/:id` | ✅ Admin | Update user |
| DELETE | `/:id` | ✅ Admin | Delete user |
| PATCH | `/:id/toggle-status` | ✅ Admin | Toggle user active status |

## Key Features Implemented

### 🔐 Authentication & Security
- ✅ User registration with validation
- ✅ User login with email/password
- ✅ JWT token generation and verification
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Password comparison for login
- ✅ Change password functionality
- ✅ Token expiration handling
- ✅ Protected routes with middleware

### 👤 User Management
- ✅ Get all users with pagination
- ✅ Filter users by email, country, age, role, status
- ✅ Get user by ID
- ✅ Update user details
- ✅ Delete user
- ✅ Toggle user active status
- ✅ Search users

### 📊 Analytics
- ✅ User statistics (total, active, inactive)
- ✅ Users by role aggregation
- ✅ Users by country aggregation
- ✅ Recent users list

### 🛡️ Authorization
- ✅ Role-based access control (user, admin, instructor)
- ✅ Admin-only routes protection
- ✅ JWT middleware for protected routes
- ✅ User status verification (active/inactive)

### ✔️ Validation
- ✅ Email format validation
- ✅ Age validation (minimum 18)
- ✅ Password length validation (minimum 6)
- ✅ Required fields validation
- ✅ Duplicate email check
- ✅ Mongoose schema validation

## User Model Schema

```javascript
{
  fullName: String (required, 2-100 chars),
  email: String (required, unique, lowercase, valid format),
  country: String (required),
  age: Number (required, 18-120),
  password: String (required, min 6 chars, auto-hashed),
  is_active: Boolean (default: true),
  role: Enum ['user', 'admin', 'instructor'] (default: 'user'),
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Note:** Password is automatically hashed before saving and never returned in responses.

## Environment Configuration

```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017
DB_NAME=course_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

## Installation & Setup

1. **Install Dependencies:**
```powershell
cd backend/user-service
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (CORS middleware)
- body-parser (request parsing)
- dotenv (environment variables)
- nodemon (development auto-reload)

2. **Configure Environment:**
Update `.env` file with your settings, especially:
- `JWT_SECRET` - Use a strong random string in production
- `MONGODB_URI` - Your MongoDB connection string
- `DB_NAME` - Your database name

3. **Start Service:**
```powershell
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Service will run on: `http://localhost:5003`

## Usage Examples

### 1. Register a New User

```powershell
curl -X POST http://localhost:5003/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"fullName\": \"John Doe\",
    \"email\": \"john@example.com\",
    \"country\": \"USA\",
    \"age\": 25,
    \"password\": \"password123\"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "country": "USA",
      "age": 25,
      "role": "user",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```powershell
curl -X POST http://localhost:5003/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    \"email\": \"john@example.com\",
    \"password\": \"password123\"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile (Protected)

```powershell
curl -X GET http://localhost:5003/api/auth/profile `
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Get All Users (Admin Only)

```powershell
curl -X GET "http://localhost:5003/api/users?page=1&limit=10" `
  -H "Authorization: Bearer ADMIN_JWT_TOKEN_HERE"
```

### 5. Get User Statistics (Admin Only)

```powershell
curl -X GET http://localhost:5003/api/users/stats `
  -H "Authorization: Bearer ADMIN_JWT_TOKEN_HERE"
```

## Authentication Flow

### Registration Flow
```
1. User submits registration form
2. Server validates input (required fields, age, email format)
3. Check if email already exists
4. Hash password with bcrypt
5. Create user in database
6. Generate JWT token
7. Return user data + token
```

### Login Flow
```
1. User submits email + password
2. Find user by email
3. Check if user is active
4. Compare password with hashed password
5. Update last login timestamp
6. Generate JWT token
7. Return user data + token
```

### Protected Route Access
```
1. Client sends request with JWT in Authorization header
2. authMiddleware extracts and verifies token
3. Token decoded to get user ID
4. User loaded from database
5. User info attached to req.user
6. Request proceeds to controller
```

### Admin Route Access
```
1. Request passes through authMiddleware (user authenticated)
2. adminMiddleware checks req.user.role
3. If role !== 'admin', return 403 Forbidden
4. If admin, request proceeds to controller
```

## Error Handling

All responses follow consistent format:

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**
- `200` OK - Successful request
- `201` Created - Resource created successfully
- `400` Bad Request - Validation error or invalid input
- `401` Unauthorized - Missing or invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Duplicate resource (e.g., email exists)
- `500` Internal Server Error - Server error

## Testing the Service

### Health Check
```powershell
curl http://localhost:5003/health
```

Expected: `{ "status": "User Service is running" }`

### Test Complete Flow
1. Register a user → Save the token
2. Login with same credentials → Verify token returned
3. Get profile using token → Verify user data
4. Update profile → Verify changes
5. Change password → Verify success
6. Login with new password → Verify works

## Integration with Frontend

### Setting Up Axios

```typescript
// src/services/AuthService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5003/api/auth';

export const AuthService = {
  register: async (userData: any) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
```

### Axios Interceptor for Token

```typescript
// Add token to all requests automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (redirect to login)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Security Best Practices Implemented

✅ **Password Security**
- Passwords hashed with bcrypt (10 salt rounds)
- Passwords never returned in API responses
- Password validation (minimum 6 characters)

✅ **JWT Security**
- Tokens signed with secret key
- Token expiration (7 days default)
- Token verification on protected routes

✅ **Input Validation**
- Email format validation
- Age range validation
- Required field checking
- Mongoose schema validation

✅ **Access Control**
- Role-based authorization
- Protected routes require authentication
- Admin routes require admin role

✅ **Data Protection**
- Sensitive fields excluded from responses
- User status checking (active/inactive)
- Last login tracking

## Next Steps / Future Enhancements

### High Priority
- [ ] Email verification on registration
- [ ] Forgot password / Reset password functionality
- [ ] Refresh token mechanism
- [ ] Rate limiting for login attempts
- [ ] Account lockout after failed attempts

### Medium Priority
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, Facebook, GitHub)
- [ ] Password strength meter
- [ ] User activity logging
- [ ] Session management

### Low Priority
- [ ] Profile picture upload
- [ ] User preferences
- [ ] Email notifications
- [ ] Account deletion (soft delete)
- [ ] Export user data

## Troubleshooting

### Cannot connect to MongoDB
- Ensure MongoDB is running: `net start MongoDB`
- Check MONGODB_URI in .env
- Verify network connectivity

### JWT token invalid
- Check JWT_SECRET is set in .env
- Ensure token is sent in Authorization header
- Verify token hasn't expired

### Permission denied errors
- Check user role (admin routes need admin role)
- Verify token is valid and user exists
- Check if user is_active = true

## Integration with Other Services

This user-service can be integrated with:

1. **course-search-service** - User enrollment, course progress
2. **course-add-service** - Instructor verification, course authorship
3. **API Gateway** - Centralized routing and authentication
4. **Notification Service** - Email verification, password reset emails

## Conclusion

The user-service is now complete with:
- ✅ Full authentication system (register/login)
- ✅ JWT-based authorization
- ✅ User management (CRUD)
- ✅ Role-based access control
- ✅ Password security
- ✅ Input validation
- ✅ Error handling
- ✅ Clean architecture
- ✅ Comprehensive documentation

Ready to use! Just run `npm install` and `npm run dev` to start the service.
