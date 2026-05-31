const Product = require('../models/Product');

// Get all products with optional filters (keyword, category, price)
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
      : {};

    const category = req.query.category ? { type: req.query.category } : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const price = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    const filter = { ...keyword, ...category, ...price, isDeleted: { $ne: true } };

    let sort = {};
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') sort.price = 1;
      if (req.query.sort === 'price_desc') sort.price = -1;
    }

    const products = await Product.find(filter).sort(sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get a single product by its ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      type: 'Sample category',
      description: 'Sample description',
      discount: 0,
      unit: '1kg',
      countInStock: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update an existing product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, type, discount, unit, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.type = type;
      product.discount = discount;
      product.unit = unit || product.unit;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Move a product to trash /  delete (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isDeleted = true;
      await product.save();
      res.json({ message: 'Product moved to trash' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all deleted products (Admin only)
const getDeletedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Restore a deleted product (Admin only)
const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isDeleted = false;
      await product.save();
      res.json({ message: 'Product restored successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Permanently delete a product (Admin only)
const hardDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product permanently deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Permanently delete all products in the trash (Admin only)
const emptyProductTrash = async (req, res) => {
  try {
    await Product.deleteMany({ isDeleted: true });
    res.json({ message: 'Trash emptied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDeletedProducts,
  restoreProduct,
  hardDeleteProduct,
  emptyProductTrash,
};
