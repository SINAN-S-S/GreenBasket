import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiSave, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import "../userCss/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      
      const fetchMyOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      
      fetchMyOrders();
    }
  }, [user]);

  const cancelOrderHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/cancel`, {}, config);
        
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your order has been successfully cancelled.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Refresh orders
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
      } catch (error) {
        console.error("Failed to cancel order", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to cancel order'
        });
      }
    }
  };

  const deleteOrderHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: "Are you sure you want to permanently remove this cancelled order from your history?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/orders/${id}`, config);
        
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Order Deleted',
          showConfirmButton: false,
          timer: 1500
        });

        // Refresh orders
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
      } catch (error) {
        console.error("Failed to delete order", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete order'
        });
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, email, password },
        config
      );

      setMessage('Profile updated successfully!');
      // Update local storage to keep session valid
      localStorage.setItem('userInfo', JSON.stringify(data));
      // In a real app we'd dispatch an update to AuthContext, but a reload works for simplicity
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return <div style={{textAlign: 'center', padding: '5rem 0'}}>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            {user.isAdmin && (
              <span className="profile-admin-badge">Admin Account</span>
            )}
          </div>

          {message && (
            <div className="profile-alert-success">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="profile-alert-error">
              {errorMsg}
            </div>
          )}

          <form onSubmit={submitHandler} className="profile-form">
            <div className="profile-form-group">
              <label className="profile-label">Full Name</label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon">
                  <FiUser />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="profile-input"
                />
              </div>
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Email Address</label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon">
                  <FiMail />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="profile-input"
                />
              </div>
            </div>

            <div className="profile-password-section">
              <h3 className="profile-password-title">Change Password</h3>
              <p className="profile-password-desc">Leave blank if you do not want to change your password.</p>
              
              <div className="profile-password-inputs">
                <div className="profile-input-wrapper">
                  <div className="profile-input-icon">
                    <FiLock />
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="profile-input"
                  />
                </div>

                <div className="profile-input-wrapper">
                  <div className="profile-input-icon">
                    <FiLock />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="profile-input"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="profile-submit-btn"
            >
              <FiSave /> Update Profile
            </button>
          </form>
        </div>
      </div>

      <div className="profile-orders-section">
        <h1 className="profile-title" style={{textAlign: 'left'}}>Order History</h1>
        
        {loadingOrders ? (
          <div className="profile-orders-loading">Loading Orders...</div>
        ) : orders.length === 0 ? (
          <div className="profile-orders-empty">
            <h2 className="profile-orders-empty-title">No Orders Yet</h2>
            <p className="profile-orders-empty-desc">You haven't placed any orders.</p>
          </div>
        ) : (
          <div className="profile-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="profile-order-card">
                <div className="profile-order-header">
                  <div>
                    <h3 className="profile-order-id">Order ID: ORD-{order._id.substring(18, 24).toUpperCase()}</h3>
                    <p className="profile-order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="profile-order-total">₹{order.totalPrice}</p>
                    {order.isCancelled ? (
                      <span className="profile-order-status-cancelled text-red-500 font-bold ml-2">Cancelled</span>
                    ) : order.isDelivered ? (
                      <span className="profile-order-status-delivered text-green-500 font-bold ml-2">Delivered</span>
                    ) : (
                      <span className="profile-order-status-pending text-yellow-500 font-bold ml-2">Pending</span>
                    )}
                    
                    {!order.isCancelled && !order.isDelivered && (
                      <button 
                        onClick={() => cancelOrderHandler(order._id)}
                        className="profile-cancel-btn"
                      >
                        Cancel Order
                      </button>
                    )}
                    
                    {order.isCancelled && (
                      <button 
                        onClick={() => deleteOrderHandler(order._id)}
                        className="profile-cancel-btn"
                        style={{ backgroundColor: '#ef4444', marginLeft: '10px' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="profile-order-items">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="profile-order-item">
                      <div className="profile-order-item-details">
                        <img src={item.image} alt={item.name} className="profile-order-item-img" />
                        <span className="profile-order-item-name">
                          <span className="profile-order-item-qty">{item.qty}x</span> {item.name} <span className="profile-order-item-unit">({item.unit || '1kg'})</span>
                        </span>
                      </div>
                      <span className="profile-order-item-price">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Order Tracking Bar */}
                {!order.isCancelled && (
                  <div className="profile-order-tracking">
                    <h4 className="profile-order-tracking-title">Track Order</h4>
                    <div className="profile-tracking-bar">
                      {/* Background Line */}
                      <div className="profile-tracking-bg-line"></div>
                      {/* Active Line */}
                      <div 
                        className={`profile-tracking-active-line`} 
                        style={{ width: order.isDelivered ? 'calc(100% - 2rem)' : 'calc(50% - 1rem)' }}
                      ></div>
                      
                      {/* Step 1: Placed */}
                      <div className="profile-tracking-step">
                        <div className="profile-tracking-icon profile-tracking-icon-active">
                          <FiPackage />
                        </div>
                        <span className="profile-tracking-label">Placed</span>
                      </div>

                      {/* Step 2: Processing */}
                      <div className="profile-tracking-step">
                        <div className={`profile-tracking-icon ${
                          order.isDelivered ? 'profile-tracking-icon-active' : 'profile-tracking-icon-processing'
                        }`}>
                          <FiTruck />
                        </div>
                        <span className={`profile-tracking-label ${order.isDelivered ? '' : 'profile-tracking-label-active'}`}>
                          {order.isDelivered ? 'Shipped' : 'Processing'}
                        </span>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="profile-tracking-step">
                        <div className={`profile-tracking-icon ${
                          order.isDelivered ? 'profile-tracking-icon-active' : 'profile-tracking-icon-inactive'
                        }`}>
                          <FiCheckCircle />
                        </div>
                        <span className={`profile-tracking-label ${order.isDelivered ? '' : 'profile-tracking-label-inactive'}`}>Delivered</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
