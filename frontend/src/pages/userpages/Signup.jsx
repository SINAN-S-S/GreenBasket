import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import "../userCss/Signup.css";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
    const res = await register(name, email, password);
    setIsLoading(false);
    
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: res.error || 'Error creating account',
        confirmButtonColor: '#f59e0b'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to GreenBasket!',
        confirmButtonColor: '#22c55e',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button 
          onClick={() => navigate('/')}
          className="auth-close-btn"
        >
          <FiX size={20} />
        </button>

        <div className="auth-header">
          <h2 className="auth-title">
            Create an account
          </h2>
          <p className="auth-subtitle">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={submitHandler}>
          <div className="auth-input-group">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="auth-input"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="auth-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="auth-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`auth-submit-btn ${
                isLoading ? 'auth-submit-btn-disabled' : 'auth-submit-btn-active'
              }`}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
