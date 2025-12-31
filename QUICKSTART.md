# Quick Start Guide

## 1. Setup Both Services

```bash
# Terminal 1 - Course Add Service
cd course-add-service
npm install
npm run dev

# Terminal 2 - Course Search Service  
cd course-search-service
npm install
npm run dev
```

## 2. Add a Course

```bash
curl -X POST http://localhost:5001/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development 101",
    "description": "Learn HTML, CSS, and JavaScript",
    "instructor": "Alex Johnson",
    "category": "Frontend",
    "price": 59.99,
    "duration": "8 weeks",
    "level": "Beginner"
  }'
```

## 3. Search for Courses

```bash
# Get all courses
curl http://localhost:5002/api/courses

# Search by category
curl "http://localhost:5002/api/courses?category=Frontend"

# Search with price filter
curl "http://localhost:5002/api/courses?minPrice=50&maxPrice=100"

# Search by keyword
curl "http://localhost:5002/api/courses?search=Web"

# Sort by price
curl "http://localhost:5002/api/courses?sortBy=price-low-to-high"
```

## 4. Advanced Searches

```bash
# By instructor
curl "http://localhost:5002/api/courses/search/by-instructor/Alex"

# By category with search
curl "http://localhost:5002/api/courses?category=Frontend&search=JavaScript"

# By level
curl "http://localhost:5002/api/courses?level=Beginner&sortBy=rating"
```

## Service Health Check

```bash
curl http://localhost:5001/health
curl http://localhost:5002/health
```
