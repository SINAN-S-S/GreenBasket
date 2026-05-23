import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import "../userCss/OrderSuccess.css";

const OrderSuccess = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && id) {
      fetchOrder();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="order-loading">
        <div className="order-loading-text">Loading Order Details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <h2 className="order-not-found-title">Order Not Found</h2>
        <Link to="/products" className="order-not-found-link">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        
        {/* Success Animation / Icon */}
        <div className="order-success-icon-container">
          <FiCheckCircle className="order-success-icon" />
        </div>
        
        <h1 className="order-success-title">Order Placed Successfully!</h1>
        <p className="order-success-desc">
          Thank you for shopping with GreenBasket. Your order has been received and is currently being processed.
        </p>

        {/* Order Details Card */}
        <div className="order-details-box">
          <div className="order-details-header">
            <div>
              <p className="order-details-label">Order ID</p>
              <p className="order-details-id">{order._id}</p>
            </div>
            <div className="order-details-amount-col">
              <p className="order-details-label">Total Amount</p>
              <p className="order-details-amount">₹{order.totalPrice}</p>
            </div>
          </div>

          <div className="order-details-grid">
            <div className="order-info-group">
              <div className="order-info-title-row">
                <FiMapPin className="order-info-icon" />
                <h3 className="order-info-title">Delivery Address</h3>
              </div>
              <p className="order-info-text">
                {order.shippingAddress?.address}<br/>
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
              </p>
            </div>

            <div className="order-info-group">
              <div className="order-info-title-row">
                <FiCreditCard className="order-info-icon" />
                <h3 className="order-info-title">Payment Method</h3>
              </div>
              <p className="order-info-text order-info-text-bold">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online UPI'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="order-success-actions">
          <Link 
            to="/profile" 
            className="btn-secondary"
          >
            <FiPackage /> View Order Tracker
          </Link>
          <Link 
            to="/products" 
            className="btn-primary"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
