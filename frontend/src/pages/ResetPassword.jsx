import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiX, FiEyeOff, FiEye } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { resettoken } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Passwords do not match',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/auth/resetpassword/${resettoken}`, { password });
      
      await Swal.fire({
        icon: 'success',
        title: 'Password Reset!',
        text: 'Your password has been reset successfully. You can now log in with your new password.',
        confirmButtonColor: '#22c55e',
        timer: 3000
      });
      
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Invalid or expired reset token',
        confirmButtonColor: '#f59e0b'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-500/50 backdrop-blur-sm fixed inset-0 z-50">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header with Logo and Close */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-20">
          <div className="w-full text-center">
            <span className="text-2xl font-bold text-brand-dark">Green<span className="text-brand-green">Basket</span></span>
          </div>
          <Link to="/" className="absolute right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2">
            <FiX size={20} />
          </Link>
        </div>

        {/* Body */}
        <div className="p-8 pt-6">
          <h2 className="text-center text-[1.35rem] font-medium text-gray-800 mb-2">
            Set New Password
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Please enter your new password below.
          </p>

          <form onSubmit={submitHandler}>
            {/* New Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-[0.9rem] text-gray-700 font-medium mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-transparent pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mb-8">
              <label htmlFor="confirm-password" className="block text-[0.9rem] text-gray-700 font-medium mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-transparent pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 rounded text-sm font-bold tracking-wide text-white transition-colors uppercase ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green'
              }`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
