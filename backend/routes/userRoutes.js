const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  syncUserCart,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/cart')
  .put(protect, syncUserCart);

module.exports = router;
