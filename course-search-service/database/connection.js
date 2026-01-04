const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    const conn = await mongoose.connect(mongoURI, {
      dbName: dbName,
    });

    console.log(`MongoDB Connected Successfully to ${dbName}`);
    console.log(`Database Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
