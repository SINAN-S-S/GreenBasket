const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  syncUserCart,
  syncUserWishlist,
  getUsers,
  getDeletedUsers,
  toggleBlockUser,
  deleteUser,
  restoreUser,
  hardDeleteUser,
  emptyUserTrash,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/deleted/all')
  .get(protect, admin, getDeletedUsers);

router.route('/deleted/all/empty')
  .delete(protect, admin, emptyUserTrash);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/block')
  .put(protect, admin, toggleBlockUser);

router.route('/:id/restore')
  .put(protect, admin, restoreUser);

router.route('/:id/hard')
  .delete(protect, admin, hardDeleteUser);

router.route('/cart')
  .put(protect, syncUserCart);

router.route('/wishlist')
  .put(protect, syncUserWishlist);

module.exports = router;
