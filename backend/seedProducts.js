require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  {
    name: 'Organic Red Apples (1kg)',
    type: 'Organic Products',
    description: 'Crisp, sweet, and locally grown organic red apples. Perfect for healthy snacking or baking.',
    price: 180,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Organic Bananas (Dozen)',
    type: 'Organic Products',
    description: 'Fresh organic bananas imported from premium organic farms.',
    price: 120,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1571501478200-249e289453b6?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Organic Carrots (500g)',
    type: 'Organic Products',
    description: 'Crunchy, sweet organic carrots loaded with vitamin A.',
    price: 60,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Organic White Quinoa (1kg)',
    type: 'Organic Products',
    description: 'Premium grade organic white quinoa, a great source of plant-based protein.',
    price: 450,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Organic Fresh Spinach (250g)',
    type: 'Organic Products',
    description: 'Freshly harvested organic baby spinach leaves.',
    price: 45,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Fresh Orange Juice (1L)',
    type: 'Fruit Juices',
    description: '100% natural, freshly squeezed orange juice with no added sugar.',
    price: 250,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Pure Apple Juice (1L)',
    type: 'Fruit Juices',
    description: 'Refreshing cold-pressed apple juice made from organic apples.',
    price: 220,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Tropical Pineapple Juice (500ml)',
    type: 'Fruit Juices',
    description: 'Sweet and tangy tropical pineapple juice.',
    price: 150,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Mixed Berry Juice (1L)',
    type: 'Fruit Juices',
    description: 'A powerful antioxidant blend of strawberries, blueberries, and raspberries.',
    price: 320,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1597825048455-22e37e5ecfb4?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Alphonso Mango Juice (1L)',
    type: 'Fruit Juices',
    description: 'Thick and pulpy juice extracted from the finest Alphonso mangoes.',
    price: 280,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=800'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    // Don't delete existing products so we don't break the user's previously added things
    // Just insert the new ones
    await Product.insertMany(products);
    console.log('10 Dummy Products added successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
