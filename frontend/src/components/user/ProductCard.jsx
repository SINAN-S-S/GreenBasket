import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiPlus, FiMinus } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import Swal from 'sweetalert2';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQty, removeFromCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const cartItem = cart.find(item => item._id === product._id);

  const handleAddToCart = () => {
    addToCart(product);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'Added to Cart',
      text: `${product.name} added to your cart!`,
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="product-card group"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="product-discount-badge">
          {product.discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`product-wishlist-btn ${isInWishlist(product._id)
            ? 'product-wishlist-active'
            : 'product-wishlist-inactive'
          }`}
      >
        <FiHeart size={16} className={isInWishlist(product._id) ? 'product-wishlist-icon-fill' : ''} />
      </button>

      {/* Image */}
      <Link to={`/product/${product._id}`} className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className={`product-image ${product.countInStock > 0 ? 'product-image-stock' : 'product-image-out'}`}
        />
        {product.countInStock === 0 && (
          <div className="product-out-overlay">
            <span className="product-out-badge">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="product-content">
        <div className="product-meta">
          <span className="product-type">{product.type}</span>
          {product.countInStock > 0 && product.countInStock <= 5 && (
            <span className="product-low-stock">Only {product.countInStock} left!</span>
          )}
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title" title={product.name}>{product.name}</h3>
        </Link>
        <p className="product-desc">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="product-footer">
          <div>
            <span className="product-price-current">₹{product.price}</span>
            <span className="product-price-unit">/ {product.unit || '1kg'}</span>
            {product.discount > 0 && (
              <span className="product-price-old">
                ₹{Math.round(product.price * (1 + product.discount / 100))}
              </span>
            )}
          </div>
          {cartItem ? (
            <div className="product-cart-controls">
              <button
                onClick={() => cartItem.qty === 1 ? removeFromCart(product._id) : updateQty(product._id, cartItem.qty - 1)}
                className="product-cart-btn-qty"
              >
                <FiMinus size={14} />
              </button>
              <span className="product-cart-qty-text">{cartItem.qty}</span>
              <button
                onClick={() => updateQty(product._id, cartItem.qty + 1)}
                disabled={cartItem.qty >= product.countInStock}
                className="product-cart-btn-qty"
              >
                <FiPlus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`product-cart-btn-add ${product.countInStock === 0
                  ? 'product-cart-btn-add-disabled'
                  : 'product-cart-btn-add-active'
                }`}
            >
              <FiShoppingBag size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
