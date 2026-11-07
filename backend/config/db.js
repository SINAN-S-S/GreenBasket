const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenbasket')
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        if (!process.env.VERCEL) {
          process.exit(1);
        }
        throw error;
      });
  }

  await cachedPromise;
};

module.exports = connectDB;
