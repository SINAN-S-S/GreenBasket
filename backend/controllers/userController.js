const User = require('../models/User');
const Order = require('../models/Order');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product').populate('wishlist');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
        wishlist: user.wishlist,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.username = req.body.username !== undefined ? req.body.username : user.username;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: req.headers.authorization.split(' ')[1],
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const syncUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.cart = req.body.cart;
      await user.save();
      res.json({ message: 'Cart synced successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const syncUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.wishlist = req.body.wishlist;
      await user.save();
      res.json({ message: 'Wishlist synced successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).select('-password').lean();
    
    for (let user of users) {
      const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
      if (latestOrder && latestOrder.shippingAddress) {
        user.address = `${latestOrder.shippingAddress.address}, ${latestOrder.shippingAddress.city}, ${latestOrder.shippingAddress.postalCode}`;
      } else {
        user.address = 'No orders yet';
      }
    }
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin && user._id.toString() === req.user._id.toString()) {
         return res.status(400).json({ message: 'You cannot block yourself' });
      }
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: user.isBlocked ? 'User Blocked' : 'User Unblocked' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin && user._id.toString() === req.user._id.toString()) {
         return res.status(400).json({ message: 'You cannot delete yourself' });
      }
      user.isDeleted = true;
      await user.save();
      res.json({ message: 'User moved to trash' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isDeleted = false;
      await user.save();
      res.json({ message: 'User restored' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const hardDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User permanently deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const emptyUserTrash = async (req, res) => {
  try {
    await User.deleteMany({ isDeleted: true });
    res.json({ message: 'Trash emptied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
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
};
