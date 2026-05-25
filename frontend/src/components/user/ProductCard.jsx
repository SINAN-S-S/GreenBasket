import React, { useState, useContext } from 'react';
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

  const isKgItem = product.unit === '1kg' || product.type === 'Vegetables' || product.type === 'Fresh Fruits';
  // Note: For simplicity, if it's a Fruit Juice or clearly not kg, we hide the selector.
  const showWeightSelector = product.type !== 'Fruit Juices' && (product.unit === '1kg' || product.unit === '500g' || product.unit === '250g');

  const weights = [
    { label: '1kg', multiplier: 1 },
    { label: '500g', multiplier: 0.5 },
    { label: '250g', multiplier: 0.25 }
  ];
  
  // Default selected weight logic
  const [selectedWeight, setSelectedWeight] = useState(showWeightSelector ? weights[0] : { label: product.unit, multiplier: 1 });

  const currentSelection = showWeightSelector ? selectedWeight : { label: product.unit, multiplier: 1 };

  const displayPrice = Math.round(product.price * currentSelection.multiplier) || 0;
  const displayOldPrice = product.discount > 0 ? Math.round(displayPrice * (1 + product.discount / 100)) : 0;

  const cartItem = cart.find(item => item._id === product._id && item.unit === currentSelection.label);

  const handleAddToCart = () => {
    addToCart({ ...product, price: displayPrice, unit: currentSelection.label });
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'Added to Cart',
      text: `${product.name} (${currentSelection.label}) added to your cart!`,
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

        {showWeightSelector ? (
          <div className="product-weight-selector" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            {weights.map((w) => (
              <button
                key={w.label}
                onClick={() => setSelectedWeight(w)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: selectedWeight.label === w.label ? '1px solid var(--color-brand-green)' : '1px solid #e5e7eb',
                  backgroundColor: selectedWeight.label === w.label ? '#f0fdf4' : '#ffffff',
                  color: selectedWeight.label === w.label ? 'var(--color-brand-green)' : '#374151',
                  fontSize: '0.75rem',
                  fontWeight: selectedWeight.label === w.label ? '600' : '500',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: '10px', fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
            Unit: {product.unit}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="product-footer">
          <div>
            <span className="product-price-current">₹{displayPrice}</span>
            {product.discount > 0 && (
              <span className="product-price-old">
                ₹{displayOldPrice}
              </span>
            )}
          </div>
          {cartItem ? (
            <div className="product-cart-controls">
              <button
                onClick={() => cartItem.qty === 1 ? removeFromCart(product._id, currentSelection.label) : updateQty(product._id, currentSelection.label, cartItem.qty - 1)}
                className="product-cart-btn-qty"
              >
                <FiMinus size={14} />
              </button>
              <span className="product-cart-qty-text">{cartItem.qty}</span>
              <button
                onClick={() => updateQty(product._id, currentSelection.label, cartItem.qty + 1)}
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
