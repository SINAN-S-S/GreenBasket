import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';
import "../userCss/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      
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
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        
        <div className="auth-modal-header">
          <div className="auth-modal-logo-container">
            <span className="auth-modal-logo">Green<span className="auth-modal-logo-highlight">Basket</span></span>
          </div>
          <Link to="/login" className="auth-modal-close">
            <FiX size={20} />
          </Link>
        </div>

        <div className="auth-modal-body">
          <h2 className="auth-modal-title">
            Forgot Password?
          </h2>
          <p className="auth-modal-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={submitHandler}>
            <div className="auth-form-group">
              <label htmlFor="email-address" className="auth-form-label">
                Email address <span className="auth-form-required">*</span>
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="auth-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="auth-footer-text">
              Remember your password? <Link to="/login" className="auth-footer-link">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
