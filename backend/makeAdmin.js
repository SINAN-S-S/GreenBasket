const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await connectDB();
    const result = await User.updateMany({}, { isAdmin: true });
    console.log(`Updated ${result.modifiedCount} users to admin.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

makeAdmin();
