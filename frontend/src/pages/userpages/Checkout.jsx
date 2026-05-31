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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const saveOrderToDB = async (isPaid) => {
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
        totalPrice: cartTotal,
        isPaid
      }, config);

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to place order', 'error');
      setCheckingOut(false);
    }
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    if (!address || !city || !postalCode) {
      Swal.fire('Missing Information', 'Please fill in all address fields.', 'warning');
      return;
    }

    setCheckingOut(true);

    if (paymentMethod === 'UPI') {
      const res = await loadRazorpay();
      if (!res) {
        Swal.fire('Error', 'Razorpay SDK failed to load', 'error');
        setCheckingOut(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const { data: orderData } = await axios.post('http://localhost:5000/api/payment/create-order', {
          amount: cartTotal
        }, config);

        if (!orderData.success) {
          Swal.fire('Error', 'Failed to create payment order', 'error');
          setCheckingOut(false);
          return;
        }

        const options = {
          key: 'rzp_test_StsYL3bwhCfGUM',
          amount: orderData.order.amount,
          currency: 'INR',
          name: 'GreenBasket',
          description: 'Payment for your order',
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              const verifyData = await axios.post('http://localhost:5000/api/payment/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }, config);

              if (verifyData.data.success) {
                await saveOrderToDB(true);
              } else {
                Swal.fire('Error', 'Payment verification failed', 'error');
                setCheckingOut(false);
              }
            } catch {
              Swal.fire('Error', 'Payment verification failed', 'error');
              setCheckingOut(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#10b981'
          },
          modal: {
            ondismiss: function() {
              setCheckingOut(false);
            }
          }
        };
        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        
        paymentObject.on('payment.failed', function (response) {
          Swal.fire('Error', response.error.description, 'error');
          setCheckingOut(false);
        });

      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to initialize payment', 'error');
        setCheckingOut(false);
      }
    } else {
      await saveOrderToDB(false);
    }
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-forms">
            
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

          <div className="checkout-summary-sidebar">
            <div className="checkout-summary-card">
              <h2 className="checkout-card-title">Order Summary</h2>
              
              <div className="checkout-delivery-est">
                <FiTruck className="checkout-delivery-icon" />
                <div>
                  <h4 className="checkout-delivery-title">Estimated Delivery</h4>
                  <p className="checkout-delivery-date">{estimatedDelivery}</p>
                </div>
              </div>

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
