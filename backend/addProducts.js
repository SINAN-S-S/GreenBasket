const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const newProducts = [
  {
    name: 'Organic Honey',
    type: 'Organic Products',
    description: 'Pure raw organic honey sourced from wild bees.',
    price: 350,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1587049352847-4d4b137a4c6a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Organic Quinoa',
    type: 'Organic Products',
    description: 'High-protein, gluten-free organic white quinoa.',
    price: 450,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Organic Almonds',
    type: 'Organic Products',
    description: 'Premium, crunchy roasted organic California almonds.',
    price: 850,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Organic Matcha Tea',
    type: 'Organic Products',
    description: 'Ceremonial grade pure organic green matcha tea.',
    price: 1200,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1582787032235-901b0b5e98bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Organic Oats',
    type: 'Organic Products',
    description: 'Rolled organic oats, perfect for a healthy breakfast.',
    price: 250,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Fresh Orange Juice',
    type: 'Fruit Juices',
    description: '100% natural, freshly squeezed pulp-free orange juice.',
    price: 150,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pomegranate Juice',
    type: 'Fruit Juices',
    description: 'Rich, antioxidant-packed pure pomegranate juice.',
    price: 220,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Apple Cider',
    type: 'Fruit Juices',
    description: 'Crisp, cold-pressed sweet apple cider.',
    price: 180,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1605338006764-4e2b02bfec01?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tropical Mix Juice',
    type: 'Fruit Juices',
    description: 'A refreshing blend of mango, pineapple, and passionfruit.',
    price: 190,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Watermelon Slush',
    type: 'Fruit Juices',
    description: 'Hydrating and cool natural watermelon juice.',
    price: 120,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1589533610925-1c6c06a640ce?auto=format&fit=crop&w=600&q=80',
  }
];

const addData = async () => {
  try {
    await connectDB();
    
    await Product.insertMany(newProducts);
    console.log('10 products added successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

addData();
