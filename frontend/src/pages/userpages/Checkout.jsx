import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { FiMapPin, FiCreditCard, FiTruck, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../userCss/Checkout.css";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    if (!address || !city || !postalCode) {
      Swal.fire('Missing Information', 'Please fill in all address fields.', 'warning');
      return;
    }

    setCheckingOut(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
        unit: item.unit || '1kg'
      }));

      const { data } = await axios.post('http://localhost:5000/api/orders', {
        orderItems,
        shippingAddress: { address, city, postalCode },
        paymentMethod,
        totalPrice: cartTotal
      }, config);

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to place order', 'error');
      setCheckingOut(false);
    }
  };

  // Calculate estimated delivery
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Left Column: Forms */}
          <div className="checkout-forms">
            
            {/* Shipping Address Form */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                <FiMapPin className="checkout-card-title-icon" /> Shipping Address
              </h2>
              <form className="checkout-form">
                <div className="checkout-form-group">
                  <label className="checkout-label">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, Apartment 4B"
                    className="checkout-input"
                  />
                </div>
                <div className="checkout-form-grid">
                  <div className="checkout-form-group">
                    <label className="checkout-label">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label className="checkout-label">Pincode / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001"
                      className="checkout-input"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                <FiCreditCard className="checkout-card-title-icon" /> Payment Method
              </h2>
              <div className="checkout-payment-methods">
                <label className={`checkout-payment-label ${paymentMethod === 'COD' ? 'checkout-payment-label-active' : 'checkout-payment-label-inactive'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="checkout-radio"
                  />
                  <div className="checkout-payment-info">
                    <span className="checkout-payment-name">Cash on Delivery (COD)</span>
                    <span className="checkout-payment-desc">Pay when you receive your order</span>
                  </div>
                </label>

                <label className={`checkout-payment-label ${paymentMethod === 'UPI' ? 'checkout-payment-label-active' : 'checkout-payment-label-inactive'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="UPI" 
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="checkout-radio"
                  />
                  <div className="checkout-payment-info">
                    <span className="checkout-payment-name">UPI / Pay Online</span>
                    <span className="checkout-payment-desc">Pay instantly via any UPI app</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-sidebar">
            <div className="checkout-summary-card">
              <h2 className="checkout-card-title">Order Summary</h2>
              
              {/* Delivery Estimation */}
              <div className="checkout-delivery-est">
                <FiTruck className="checkout-delivery-icon" />
                <div>
                  <h4 className="checkout-delivery-title">Estimated Delivery</h4>
                  <p className="checkout-delivery-date">{estimatedDelivery}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="checkout-items">
                {cart.map((item, idx) => (
                  <div key={idx} className="checkout-item-row">
                    <span className="checkout-item-name"><span className="checkout-item-qty">{item.qty}x</span> {item.name}</span>
                    <span className="checkout-item-price">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-summary-details">
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Subtotal</span>
                  <span className="checkout-summary-val">₹{cartTotal}</span>
                </div>
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Shipping</span>
                  <span className="checkout-summary-val-green">Free</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'right', lineHeight: '1.4' }}>
                  Free Delivery on orders over ₹500<br/>
                  (Otherwise ₹2 added per 1 km)
                </div>
              </div>
              
              <div className="checkout-total-container">
                <div className="checkout-total-row">
                  <span className="checkout-total-label">Total to Pay</span>
                  <span className="checkout-total-val">₹{cartTotal}</span>
                </div>
              </div>

              <button 
                onClick={placeOrderHandler}
                disabled={checkingOut}
                className="checkout-btn"
              >
                {checkingOut ? 'Processing...' : (
                  <>Place Order <FiArrowRight /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
