# Course Management Microservices

Two Node.js microservices for managing and searching courses with MongoDB.

## Project Structure

```
backend/
├── course-add-service/          # Microservice for adding/updating/deleting courses
│   ├── models/
│   │   └── Course.js            # MongoDB Course schema
│   ├── routes/
│   │   └── courseRoutes.js       # API endpoints for course operations
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env
│
└── course-search-service/       # Microservice for searching courses
    ├── models/
    │   └── Course.js            # MongoDB Course schema
    ├── routes/
    │   └── courseRoutes.js       # API endpoints for course search
    ├── server.js                # Express server
    ├── package.json
    └── .env
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or via Atlas)
- npm or yarn

## Installation

### 1. Install Course Add Service

```bash
cd course-add-service
npm install
```

### 2. Install Course Search Service

```bash
cd course-search-service
npm install
```

## Configuration

Both services use `.env` files for configuration. Update them as needed:

**course-add-service/.env:**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/courses_db
NODE_ENV=development
```

**course-search-service/.env:**
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/courses_db
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/courses_db
```

## Running the Services

### Start Course Add Service
```bash
cd course-add-service
npm start        # Production
npm run dev      # Development with nodemon
```
Service runs on: `http://localhost:5001`

### Start Course Search Service
```bash
cd course-search-service
npm start        # Production
npm run dev      # Development with nodemon
```
Service runs on: `http://localhost:5002`

## API Endpoints

### Course Add Service (Port 5001)

**Add a Course**
- `POST /api/courses`
- Body:
```json
{
  "title": "Node.js Basics",
  "description": "Learn Node.js from scratch",
  "instructor": "John Doe",
  "category": "Backend",
  "price": 49.99,
  "duration": "4 weeks",
  "level": "Beginner"
}
```

**Update a Course**
- `PUT /api/courses/:id`

**Delete a Course**
- `DELETE /api/courses/:id`

**Health Check**
- `GET /health`

---

### Course Search Service (Port 5002)

**Get All Courses**
- `GET /api/courses`
- Query Parameters:
  - `category` - Filter by category
  - `level` - Filter by level (Beginner, Intermediate, Advanced)
  - `minPrice` - Minimum price
  - `maxPrice` - Maximum price
  - `search` - Search in title, description, or instructor
  - `sortBy` - Sort by: price-low-to-high, price-high-to-low, rating, newest

Example: `/api/courses?category=Backend&sortBy=price-low-to-high`

**Get Course by ID**
- `GET /api/courses/:id`

**Search by Category**
- `GET /api/courses/search/by-category/:category`

**Search by Instructor**
- `GET /api/courses/search/by-instructor/:instructor`

**Health Check**
- `GET /health`

## Course Schema

```javascript
{
  title: String (required),
  description: String (required),
  instructor: String (required),
  category: String (required),
  price: Number (required),
  duration: String (required),
  level: String (Beginner, Intermediate, Advanced),
  enrollmentCount: Number (default: 0),
  rating: Number (0-5, default: 0),
  isActive: Boolean (default: true),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Example Usage

### 1. Add a Course
```bash
curl -X POST http://localhost:5001/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python for Beginners",
    "description": "Complete Python course",
    "instructor": "Jane Smith",
    "category": "Backend",
    "price": 39.99,
    "duration": "6 weeks",
    "level": "Beginner"
  }'
```

### 2. Search Courses
```bash
curl "http://localhost:5002/api/courses?category=Backend&sortBy=price-low-to-high"
```

### 3. Search by Keyword
```bash
curl "http://localhost:5002/api/courses?search=Python"
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables
- **Nodemon** - Development auto-reload

## Notes

- Both services share the same MongoDB database (`courses_db`)
- The Course Add Service handles all write operations
- The Course Search Service handles all read operations
- Each service can be scaled independently
- Consider adding authentication for production use
