import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      
      // Simulate sending email by showing the link in a SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        html: `
          <p class="mb-4">For this demo, here is your password reset link:</p>
          <a href="${data.resetUrl}" class="text-brand-green break-all hover:underline font-medium">
            ${data.resetUrl}
          </a>
          <p class="mt-4 text-sm text-gray-500">Copy this link or click it to reset your password.</p>
        `,
        confirmButtonColor: '#22c55e'
      });
      setEmail('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error sending password reset email',
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
          <Link to="/login" className="absolute right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2">
            <FiX size={20} />
          </Link>
        </div>

        {/* Body */}
        <div className="p-8 pt-6">
          <h2 className="text-center text-[1.35rem] font-medium text-gray-800 mb-2">
            Forgot Password?
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={submitHandler}>
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email-address" className="block text-[0.9rem] text-gray-700 font-medium mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 rounded text-sm font-bold tracking-wide text-white transition-colors uppercase ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Footer text */}
            <div className="mt-5 text-center text-[0.95rem] text-gray-700">
              Remember your password? <Link to="/login" className="text-brand-green font-medium hover:underline">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
