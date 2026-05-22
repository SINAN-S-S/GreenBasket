const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getDeletedProducts,
  restoreProduct,
  hardDeleteProduct,
  emptyProductTrash
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/deleted/all').get(protect, admin, getDeletedProducts);
router.route('/deleted/all/empty').delete(protect, admin, emptyProductTrash);
router.route('/:id/restore').put(protect, admin, restoreProduct);
router.route('/:id/hard').delete(protect, admin, hardDeleteProduct);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
