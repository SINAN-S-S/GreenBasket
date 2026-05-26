const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
require('dotenv').config();

const testApiCancel = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenbasket');
    
    // Find an admin user to get a token
    const user = await User.findOne({ isAdmin: true });
    if (!user) {
      console.log('No user found');
      process.exit(1);
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    // Create a dummy order first
    const product = await Product.findOne({});
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const newOrderPayload = {
      orderItems: [{
        name: product.name,
        qty: 1,
        image: product.image,
        price: product.price,
        unit: product.unit,
        product: product._id
      }],
      shippingAddress: { address: '123', city: '123', postalCode: '123' },
      paymentMethod: 'COD',
      totalPrice: product.price
    };

    const createRes = await axios.post(`http://localhost:5000/api/orders`, newOrderPayload, config);
    const orderId = createRes.data._id;
    console.log(`Created order: ${orderId}`);
    
    // Cancel it
    const cancelRes = await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, config);
    console.log('Success:', cancelRes.data);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

testApiCancel();
