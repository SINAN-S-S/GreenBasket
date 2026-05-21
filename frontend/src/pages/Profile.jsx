import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
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
    </div>
  );
};

export default Profile;
