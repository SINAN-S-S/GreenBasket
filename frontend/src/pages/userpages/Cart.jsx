import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../userCss/Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      Swal.fire('Login Required', 'Please login to proceed to checkout!', 'info');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2 className="cart-empty-title">Your cart is empty</h2>
          <p className="cart-empty-desc">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="cart-empty-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-container">
            <div className="cart-items-card">
              <ul className="cart-items-list">
                {cart.map((item) => (
                  <li key={item._id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    
                    <div className="cart-item-info">
                      <Link to={`/product/${item._id}`}>
                        <h3 className="cart-item-title">{item.name}</h3>
                      </Link>
                      <p className="cart-item-type">{item.type}</p>
                      <p className="cart-item-price">
                        ₹{item.price} 
                        <span className="cart-item-price-unit">/ {item.unit || '1kg'}</span>
                      </p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-qty-control">
                        <button 
                          onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                          className="cart-qty-btn"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="cart-qty-value">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          disabled={item.qty >= item.countInStock}
                          className={`cart-qty-btn cart-qty-btn-small ${
                            item.qty >= item.countInStock ? 'cart-qty-btn-disabled' : ''
                          }`}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="cart-remove-btn"
                        title="Remove Item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-clear-container">
                <button 
                  onClick={clearCart}
                  className="cart-clear-btn"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-sidebar">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Order Summary</h2>
              
              <div className="cart-summary-details">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span className="cart-summary-val">₹{cartTotal}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span className="cart-summary-val-green">Free</span>
                </div>
                <div className="cart-summary-row">
                  <span>Tax</span>
                  <span className="cart-summary-val">₹0</span>
                </div>
              </div>
              
              <div className="cart-summary-total-container">
                <div className="cart-summary-row">
                  <span className="cart-summary-total">Total</span>
                  <span className="cart-summary-total-val">₹{cartTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="cart-checkout-btn"
              >
                Proceed to Checkout <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
