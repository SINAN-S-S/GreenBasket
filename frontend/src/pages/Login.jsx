import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 space-y-8 relative z-10 animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <FiX size={20} />
        </button>

        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-brand-dark">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-brand-green hover:text-brand-dark transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        


        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="rounded-md shadow-sm space-y-4">
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
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm bg-white/90"
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
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm bg-white/90"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-brand-green hover:text-brand-dark transition-colors">
                Lost your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors shadow-md ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green'
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
