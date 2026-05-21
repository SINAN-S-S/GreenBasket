const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

connectDB();

const products = [
  {
    name: 'Fresh Red Apple',
    type: 'Fresh Fruits',
    description: 'Crisp and juicy fresh red apples directly from organic farms.',
    price: 150, // Price in INR
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=500&q=60',
    discount: 10,
  },
  {
    name: 'Organic Banana',
    type: 'Fresh Fruits',
    description: 'Sweet and nutritious organic bananas.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60',
    discount: 5,
  },
  {
    name: 'Nagpur Orange',
    type: 'Fresh Fruits',
    description: 'Tangy and sweet fresh oranges from Nagpur.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=60',
    discount: 0,
  },
  {
    name: 'Green Grapes',
    type: 'Fresh Fruits',
    description: 'Seedless fresh green grapes.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=500&q=60',
    discount: 15,
  },
  {
    name: 'Fresh Strawberries',
    type: 'Fresh Fruits',
    description: 'Delicious and fresh farm strawberries.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=60',
    discount: 20,
  },
  {
    name: 'Organic Carrot',
    type: 'Vegetables',
    description: 'Crunchy and sweet organic carrots.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1594951169622-c423ef211ef5?auto=format&fit=crop&w=500&q=60',
    discount: 0,
  },
  {
    name: 'Fresh Broccoli',
    type: 'Vegetables',
    description: 'Nutrient-rich fresh green broccoli.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=60',
    discount: 10,
  },
  {
    name: 'Iceberg Lettuce',
    type: 'Vegetables',
    description: 'Crisp iceberg lettuce for healthy salads.',
    price: 70,
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=60',
    discount: 0,
  },
  {
    name: 'Red Tomato',
    type: 'Vegetables',
    description: 'Farm-fresh juicy red tomatoes.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60',
    discount: 5,
  },
  {
    name: 'Fresh Cucumber',
    type: 'Vegetables',
    description: 'Hydrating and crisp fresh cucumbers.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=500&q=60',
    discount: 0,
  },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@greenbasket.com',
      password: 'password123',
      isAdmin: true,
    });

    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
