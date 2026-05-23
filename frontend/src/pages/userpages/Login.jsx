import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import "../userCss/Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await login(email, password);
    setIsLoading(false);
    
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: res.error || 'Invalid email or password',
        confirmButtonColor: '#f59e0b'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'You have successfully logged in.',
        confirmButtonColor: '#22c55e',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        {/* Close Button */}
        <button 
          onClick={() => navigate('/')}
          className="auth-close-btn"
        >
          <FiX size={20} />
        </button>

        <div className="auth-header">
          <h2 className="auth-title">
            Sign in to your account
          </h2>
          <p className="auth-subtitle">
            Or{' '}
            <Link to="/signup" className="auth-link">
              create a new account
            </Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={submitHandler}>
          <div className="auth-input-group">
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
                autoComplete="current-password"
                required
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-form-actions">
            <div className="text-sm">
              <Link to="/forgot-password" className="auth-link">
                Lost your password?
              </Link>
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
