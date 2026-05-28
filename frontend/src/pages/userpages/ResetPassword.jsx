import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiX, FiEyeOff, FiEye } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';
import "../userCss/ResetPassword.css";

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
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        
        <div className="auth-modal-header">
          <div className="auth-modal-logo-container">
            <span className="auth-modal-logo">Green<span className="auth-modal-logo-highlight">Basket</span></span>
          </div>
          <Link to="/" className="auth-modal-close">
            <FiX size={20} />
          </Link>
        </div>

        <div className="auth-modal-body">
          <h2 className="auth-modal-title">
            Set New Password
          </h2>
          <p className="auth-modal-subtitle">
            Please enter your new password below.
          </p>

          <form onSubmit={submitHandler}>
            <div className="auth-form-group">
              <label htmlFor="password" className="auth-form-label">
                New Password <span className="auth-form-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="auth-form-input auth-form-input-pwd"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-pwd-toggle"
                >
                  {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="confirm-password" className="auth-form-label">
                Confirm New Password <span className="auth-form-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="auth-form-input auth-form-input-pwd"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-pwd-toggle"
                >
                  {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
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
