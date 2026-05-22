import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiSave, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

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
    return <div className="text-center py-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-12 flex justify-center">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-brand-light text-brand-green rounded-full flex items-center justify-center text-3xl font-bold mb-4">
              {name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.isAdmin && (
              <span className="mt-2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">Admin Account</span>
            )}
          </div>

          {message && (
            <div className="bg-green-50 text-brand-green p-4 rounded-xl mb-6 text-center font-medium border border-green-100">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-center font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">Leave blank if you do not want to change your password.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-green text-white py-4 rounded-xl hover:bg-brand-dark transition-colors font-bold shadow-md mt-8"
            >
              <FiSave /> Update Profile
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-3xl w-full lg:ml-8 mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>
        
        {loadingOrders ? (
          <div className="text-center py-10 text-brand-green">Loading Orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500">You haven't placed any orders.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-800">Order ID: {order._id.substring(18, 24)}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-green">₹{order.totalPrice}</p>
                    {order.isDelivered ? (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md">Delivered</span>
                    ) : (
                      <span className="inline-block mt-1 px-2 py-1 bg-orange-50 text-orange-500 text-xs font-bold rounded-md">Pending</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-50" />
                        <span className="text-gray-700">
                          <span className="font-bold">{item.qty}x</span> {item.name} <span className="text-xs text-gray-400 font-medium">({item.unit || '1kg'})</span>
                        </span>
                      </div>
                      <span className="font-medium text-gray-600">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Order Tracking Bar */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-6">Track Order</h4>
                  <div className="relative flex justify-between items-center w-full px-4 sm:px-8">
                    {/* Background Line */}
                    <div className="absolute left-4 right-4 top-5 -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full"></div>
                    {/* Active Line */}
                    <div 
                      className={`absolute left-4 top-5 -translate-y-1/2 h-1 bg-brand-green z-0 rounded-full transition-all duration-700`} 
                      style={{ width: order.isDelivered ? 'calc(100% - 2rem)' : 'calc(50% - 1rem)' }}
                    ></div>
                    
                    {/* Step 1: Placed */}
                    <div className="relative z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center shadow-md border-4 border-white mb-2">
                        <FiPackage />
                      </div>
                      <span className="text-xs font-bold text-gray-800">Placed</span>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="relative z-10 flex flex-col items-center group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-4 border-white mb-2 transition-colors ${
                        order.isDelivered ? 'bg-brand-green text-white' : 'bg-brand-green text-white animate-pulse shadow-brand-green/30'
                      }`}>
                        <FiTruck />
                      </div>
                      <span className={`text-xs font-bold ${order.isDelivered ? 'text-gray-800' : 'text-brand-green'}`}>
                        {order.isDelivered ? 'Shipped' : 'Processing'}
                      </span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="relative z-10 flex flex-col items-center group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-4 border-white mb-2 transition-colors ${
                        order.isDelivered ? 'bg-brand-green text-white shadow-brand-green/30' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <FiCheckCircle />
                      </div>
                      <span className={`text-xs font-bold ${order.isDelivered ? 'text-gray-800' : 'text-gray-400'}`}>Delivered</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
