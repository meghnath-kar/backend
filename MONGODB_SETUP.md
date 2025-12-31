# MongoDB Setup Guide

## Local MongoDB Setup (Windows)

### Option 1: Install MongoDB Community Edition

1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. By default, MongoDB runs on `localhost:27017`

### Option 2: Using MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string and update `.env` files:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/courses_db
   ```

## Verify MongoDB Connection

After starting your services, check the console logs:
```
MongoDB connected successfully
```

## Testing with MongoDB Compass

1. Download MongoDB Compass from: https://www.mongodb.com/products/tools/compass
2. Connect to `mongodb://localhost:27017`
3. Create a database named `courses_db`
4. View collections created by the services

## Environment Variables

### Development Setup

For local MongoDB on Windows:
```env
MONGODB_URI=mongodb://localhost:27017/courses_db
NODE_ENV=development
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/courses_db?retryWrites=true&w=majority
NODE_ENV=development
```

## Troubleshooting

**MongoDB Connection Refused:**
- Make sure MongoDB service is running
- Check if port 27017 is not blocked
- Verify connection string in `.env`

**Module Not Found:**
- Run `npm install` in both service directories

**Port Already in Use:**
- Change PORT in `.env` to an available port
