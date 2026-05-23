import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingBag, FiHeart, FiPlus, FiMinus, FiTruck, FiShield } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import Swal from 'sweetalert2';
import "../userCss/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, updateQty, removeFromCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  if (loading) {
    return <div className="product-detail-loading">Loading...</div>;
  }

  if (!product.name) {
    return <div className="product-detail-not-found">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <Link to="/products" className="product-detail-back">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="product-detail-container">
        <div className="product-detail-grid">
          
          {/* Image Section */}
          <div className="product-detail-img-container">
            {product.discount > 0 && (
              <div className="product-detail-badge">
                {product.discount}% OFF
              </div>
            )}
            <button 
              onClick={() => toggleWishlist(product)}
              className={`product-detail-wishlist ${
                isInWishlist(product._id) ? 'product-detail-wishlist-active' : 'product-detail-wishlist-inactive'
              }`}
            >
              <FiHeart size={20} className={isInWishlist(product._id) ? 'fill-current' : ''} />
            </button>
            <img src={product.image} alt={product.name} className="product-detail-img" />
          </div>

          {/* Details Section */}
          <div className="product-detail-info">
            <div className="product-detail-meta">
              <span className="product-detail-type">
                {product.type}
              </span>
              {product.countInStock > 0 ? (
                <span className="product-detail-stock product-detail-stock-in">
                  In Stock: {product.countInStock}
                </span>
              ) : (
                <span className="product-detail-stock product-detail-stock-out">
                  Out of Stock
                </span>
              )}
            </div>
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-pricing">
              <span className="product-detail-price-current">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="product-detail-price-old">
                  ₹{Math.round(product.price * (1 + product.discount/100))}
                </span>
              )}
              <span className="product-detail-price-unit">/ {product.unit || '1kg'}</span>
            </div>

            <p className="product-detail-desc">
              {product.description}
            </p>

            <div className="product-detail-features">
              <div className="feature-item">
                <div className="feature-icon feature-icon-green">
                  <FiTruck />
                </div>
                <div>
                  <h4 className="feature-text-title">Free Delivery</h4>
                  <p className="feature-text-subtitle">On orders over ₹500</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon feature-icon-blue">
                  <FiShield />
                </div>
                <div>
                  <h4 className="feature-text-title">Quality Guarantee</h4>
                  <p className="feature-text-subtitle">100% fresh & organic</p>
                </div>
              </div>
            </div>

            <div className="product-detail-actions">
              {cartItem ? (
                <div className="product-detail-qty-control">
                  <button 
                    onClick={() => cartItem.qty === 1 ? removeFromCart(product._id) : updateQty(product._id, cartItem.qty - 1)}
                    className="qty-btn"
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{cartItem.qty}</span>
                  <button 
                    onClick={() => updateQty(product._id, cartItem.qty + 1)}
                    disabled={cartItem.qty >= product.countInStock}
                    className="qty-btn"
                  >
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`product-detail-add-btn ${
                    product.countInStock === 0 
                      ? 'product-detail-add-btn-disabled' 
                      : 'product-detail-add-btn-active'
                  }`}
                >
                  <FiShoppingBag size={20} /> {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
