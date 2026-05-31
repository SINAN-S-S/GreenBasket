const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = 'mongodb://127.0.0.1:27017/greenbasket';

const products = [
  { name: 'Red Apple', type: 'Fresh Fruits', description: 'Fresh and crunchy red apples', unit: '1kg', price: 150, countInStock: 50, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=500&q=80', discount: 10 },
  { name: 'Banana', type: 'Fresh Fruits', description: 'Sweet ripe bananas', unit: '1 Dozen', price: 60, countInStock: 100, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&q=80', discount: 0 },
  { name: 'Orange', type: 'Fresh Fruits', description: 'Juicy oranges rich in Vitamin C', unit: '1kg', price: 80, countInStock: 60, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&q=80', discount: 5 },
  { name: 'Grapes', type: 'Fresh Fruits', description: 'Fresh green seedless grapes', unit: '500g', price: 90, countInStock: 40, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80', discount: 15 },
  { name: 'Mango', type: 'Fresh Fruits', description: 'Alphonso Mangoes', unit: '1kg', price: 300, countInStock: 20, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80', discount: 0 },
  { name: 'Pineapple', type: 'Fresh Fruits', description: 'Sweet tropical pineapple', unit: '1pc', price: 70, countInStock: 30, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&q=80', discount: 5 },
  { name: 'Strawberry', type: 'Fresh Fruits', description: 'Fresh farm strawberries', unit: '250g', price: 120, countInStock: 25, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80', discount: 10 },
  { name: 'Papaya', type: 'Fresh Fruits', description: 'Ripe and sweet papaya', unit: '1pc', price: 50, countInStock: 35, image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26af?w=500&q=80', discount: 0 },
  { name: 'Watermelon', type: 'Fresh Fruits', description: 'Large fresh watermelon', unit: '1pc', price: 80, countInStock: 15, image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=500&q=80', discount: 20 },
  { name: 'Pomegranate', type: 'Fresh Fruits', description: 'Fresh red pomegranate', unit: '1kg', price: 180, countInStock: 45, image: 'https://images.unsplash.com/photo-1615485925600-97237c4ff1cb?w=500&q=80', discount: 5 },
  { name: 'Kiwi', type: 'Fresh Fruits', description: 'Fresh green kiwi', unit: '500g', price: 150, countInStock: 30, image: 'https://images.unsplash.com/photo-1585059895524-72359e06138a?w=500&q=80', discount: 0 },
  { name: 'Peach', type: 'Fresh Fruits', description: 'Sweet juicy peaches', unit: '500g', price: 120, countInStock: 25, image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500&q=80', discount: 10 },
  { name: 'Plum', type: 'Fresh Fruits', description: 'Fresh sweet plums', unit: '500g', price: 100, countInStock: 20, image: 'https://images.unsplash.com/photo-1590454378120-d31e5e2e8549?w=500&q=80', discount: 0 },

  { name: 'Potato', type: 'Vegetables', description: 'Fresh farm potatoes', unit: '1kg', price: 30, countInStock: 200, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', discount: 0 },
  { name: 'Tomato', type: 'Vegetables', description: 'Red ripe tomatoes', unit: '1kg', price: 40, countInStock: 150, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80', discount: 10 },
  { name: 'Onion', type: 'Vegetables', description: 'Fresh red onions', unit: '1kg', price: 35, countInStock: 300, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80', discount: 0 },
  { name: 'Carrot', type: 'Vegetables', description: 'Fresh orange carrots', unit: '1kg', price: 50, countInStock: 100, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80', discount: 5 },
  { name: 'Cabbage', type: 'Vegetables', description: 'Fresh green cabbage', unit: '1pc', price: 40, countInStock: 80, image: 'https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=500&q=80', discount: 0 },
  { name: 'Cauliflower', type: 'Vegetables', description: 'Fresh cauliflower', unit: '1pc', price: 45, countInStock: 60, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&q=80', discount: 5 },
  { name: 'Broccoli', type: 'Vegetables', description: 'Healthy green broccoli', unit: '500g', price: 80, countInStock: 40, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&q=80', discount: 10 },
  { name: 'Spinach', type: 'Vegetables', description: 'Fresh green spinach bundle', unit: '1 Bundle', price: 20, countInStock: 120, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', discount: 0 },
  { name: 'Capsicum', type: 'Vegetables', description: 'Green bell peppers', unit: '500g', price: 60, countInStock: 70, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80', discount: 15 },
  { name: 'Cucumber', type: 'Vegetables', description: 'Fresh cucumbers for salad', unit: '1kg', price: 40, countInStock: 90, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80', discount: 0 },

  { name: 'Organic Honey', type: 'Organic Products', description: 'Pure raw organic honey', unit: '500g', price: 350, countInStock: 40, image: 'https://images.unsplash.com/photo-1587049352847-4d4b127a5198?w=500&q=80', discount: 0 },
  { name: 'Organic Oats', type: 'Organic Products', description: 'Healthy organic rolled oats', unit: '1kg', price: 250, countInStock: 60, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&q=80', discount: 10 },
  { name: 'Organic Quinoa', type: 'Organic Products', description: 'High protein organic quinoa', unit: '500g', price: 400, countInStock: 30, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80', discount: 5 },
  { name: 'Organic Turmeric Powder', type: 'Organic Products', description: 'Pure organic turmeric powder', unit: '250g', price: 150, countInStock: 80, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80', discount: 0 },
  { name: 'Organic Green Tea', type: 'Organic Products', description: 'Premium organic green tea leaves', unit: '100g', price: 200, countInStock: 50, image: 'https://images.unsplash.com/photo-1627492275510-779836ec7a73?w=500&q=80', discount: 15 },
  { name: 'Organic Chia Seeds', type: 'Organic Products', description: 'Healthy organic chia seeds', unit: '250g', price: 250, countInStock: 45, image: 'https://images.unsplash.com/photo-1588680193183-b9dfce813088?w=500&q=80', discount: 0 },
  { name: 'Organic Almonds', type: 'Organic Products', description: 'Raw organic almonds', unit: '500g', price: 600, countInStock: 25, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&q=80', discount: 5 },
  { name: 'Organic Walnuts', type: 'Organic Products', description: 'Premium organic walnuts', unit: '250g', price: 450, countInStock: 20, image: 'https://images.unsplash.com/photo-1591599321415-32e70e9a7fb3?w=500&q=80', discount: 0 },
  { name: 'Organic Olive Oil', type: 'Organic Products', description: 'Extra virgin organic olive oil', unit: '500ml', price: 800, countInStock: 15, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80', discount: 10 },
  { name: 'Organic Brown Rice', type: 'Organic Products', description: 'Healthy organic brown rice', unit: '1kg', price: 150, countInStock: 100, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500&q=80', discount: 0 },

  { name: 'Fresh Orange Juice', type: 'Fruit Juices', description: '100% freshly squeezed orange juice', unit: '1L', price: 120, countInStock: 30, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80', discount: 0 },
  { name: 'Apple Juice', type: 'Fruit Juices', description: 'Pure clear apple juice', unit: '1L', price: 110, countInStock: 40, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', discount: 5 },
  { name: 'Mango Nectar', type: 'Fruit Juices', description: 'Thick and sweet mango nectar', unit: '1L', price: 150, countInStock: 25, image: 'https://images.unsplash.com/photo-1622597467836-f38ec9d58428?w=500&q=80', discount: 10 },
  { name: 'Pineapple Juice', type: 'Fruit Juices', description: 'Tropical pineapple juice', unit: '1L', price: 130, countInStock: 35, image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&q=80', discount: 0 },
  { name: 'Pomegranate Juice', type: 'Fruit Juices', description: 'Healthy pomegranate juice', unit: '500ml', price: 140, countInStock: 20, image: 'https://images.unsplash.com/photo-1600271801401-6415f39ab1b5?w=500&q=80', discount: 0 },
  { name: 'Mixed Fruit Juice', type: 'Fruit Juices', description: 'Blend of seasonal fruits', unit: '1L', price: 125, countInStock: 50, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&q=80', discount: 15 },
  { name: 'Grape Juice', type: 'Fruit Juices', description: 'Sweet black grape juice', unit: '1L', price: 115, countInStock: 30, image: 'https://images.unsplash.com/photo-1603051664156-f045ccf4bd80?w=500&q=80', discount: 0 },
  { name: 'Watermelon Juice', type: 'Fruit Juices', description: 'Refreshing watermelon juice', unit: '1L', price: 100, countInStock: 45, image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&q=80', discount: 10 },
  { name: 'Guava Juice', type: 'Fruit Juices', description: 'Sweet and thick guava juice', unit: '1L', price: 110, countInStock: 35, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', discount: 0 },
  { name: 'Lemonade', type: 'Fruit Juices', description: 'Fresh squeezed lemonade with mint', unit: '1L', price: 80, countInStock: 60, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', discount: 5 }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    await Product.insertMany(products);
    console.log(`${products.length} Products Imported Successfully!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
