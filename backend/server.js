// Load environment variables FIRST before any other requires
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
connectDB();

// Build list of allowed origins (normalize trailing slashes)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://green-basket-j9h5.vercel.app',
  'https://green-basket.vercel.app',
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, mobile apps, Vercel serverless internal)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');

    // Allow only trusted origins or official GreenBasket preview deployments
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      /^https:\/\/green-basket(-[a-z0-9]+)*\.vercel\.app$/.test(cleanOrigin);

    if (isAllowed) {
      return callback(null, true);
    }

    // Reject gracefully without throwing a 500 unhandled Error
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));

// Ensure MongoDB is connected for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GreenBasket API is running...' });
});

// Export app for Vercel serverless
module.exports = app;

// Start local dev server only when run directly and not on Vercel
if (!process.env.VERCEL && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
