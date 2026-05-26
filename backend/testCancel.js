const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

const testCancel = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenbasket');
    const order = await Order.findOne().sort({ createdAt: -1 });
    if (!order) {
      console.log('No orders found');
      process.exit();
    }
    console.log('Found order:', order._id);
    
    // Simulate what cancelOrder does
    order.isCancelled = true;
    order.cancelledAt = Date.now();
    await order.save();
    console.log('Successfully cancelled locally in DB');
    
    process.exit(0);
  } catch (err) {
    console.error('Error during cancel:', err);
    process.exit(1);
  }
};

testCancel();
