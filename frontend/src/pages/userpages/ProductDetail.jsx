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

  const weights = [
    { label: '1kg', multiplier: 1 },
    { label: '500g', multiplier: 0.5 },
    { label: '250g', multiplier: 0.25 }
  ];
  const [selectedWeight, setSelectedWeight] = useState(weights[0]);

  const { cart, addToCart, updateQty, removeFromCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      let retries = 3;
      while (retries > 0) {
        setLoading(true);
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
          setProduct(data);
          break; // Success, exit loop
        } catch (error) {
          console.error(`Error fetching product (retries left: ${retries - 1}):`, error);
          retries -= 1;
          if (retries === 0) {
            setLoading(false);
          } else {
            await new Promise(res => setTimeout(res, 1000));
          }
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const displayPrice = Math.round(product.price * selectedWeight.multiplier) || 0;
  const displayOldPrice = product.discount > 0 ? Math.round(displayPrice * (1 + product.discount/100)) : 0;

  const cartItem = cart.find(item => item._id === product._id && item.unit === selectedWeight.label);

  const handleAddToCart = () => {
    addToCart({ ...product, price: displayPrice, unit: selectedWeight.label });
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'Added to Cart',
      text: `${product.name} (${selectedWeight.label}) added to your cart!`,
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
              <span className="product-detail-price-current">₹{displayPrice}</span>
              {product.discount > 0 && (
                <span className="product-detail-price-old">
                  ₹{displayOldPrice}
                </span>
              )}
            </div>

            <div className="product-weight-selector" style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
              {weights.map((w) => (
                <button
                  key={w.label}
                  onClick={() => setSelectedWeight(w)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: selectedWeight.label === w.label ? '2px solid var(--color-brand-green)' : '1px solid #e5e7eb',
                    backgroundColor: selectedWeight.label === w.label ? '#f0fdf4' : '#ffffff',
                    color: selectedWeight.label === w.label ? 'var(--color-brand-green)' : '#374151',
                    fontWeight: selectedWeight.label === w.label ? '600' : '500',
                    cursor: 'pointer'
                  }}
                >
                  {w.label}
                </button>
              ))}
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
                    onClick={() => cartItem.qty === 1 ? removeFromCart(product._id, selectedWeight.label) : updateQty(product._id, selectedWeight.label, cartItem.qty - 1)}
                    className="qty-btn"
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{cartItem.qty}</span>
                  <button 
                    onClick={() => updateQty(product._id, selectedWeight.label, cartItem.qty + 1)}
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
