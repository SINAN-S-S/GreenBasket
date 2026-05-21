import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { cartItemCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="w-full px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-brand-dark flex items-center gap-2">
          <FiShoppingBag className="text-brand-green" />
          <span>Green<span className="text-brand-green">Basket</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="text-gray-700 hover:text-brand-green transition-colors">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-brand-green transition-colors">Products</Link>
          <Link to="/categories" className="text-gray-700 hover:text-brand-green transition-colors">Categories</Link>
          <Link to="#" className="text-gray-700 hover:text-brand-green transition-colors">Pages</Link>
          <Link to="#" className="text-gray-700 hover:text-brand-green transition-colors">Blog</Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-brand-green focus-within:bg-white transition-all">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
          />
          <FiSearch className="text-gray-500" />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button className="text-gray-700 hover:text-brand-green transition-colors hidden sm:block">
            <FiHeart size={22} />
          </button>
          
          {user ? (
            <div className="relative group cursor-pointer hidden sm:flex items-center gap-2">
              <Link to="/profile" className="text-sm font-medium text-brand-dark bg-brand-light px-3 py-1 rounded-full hover:bg-brand-green hover:text-white transition-colors">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-500 transition-colors" title="Logout">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-brand-green transition-colors hidden sm:block" title="Login">
              <FiUser size={22} />
            </Link>
          )}

          <Link to="/cart" className="relative text-gray-700 hover:text-brand-green transition-colors">
            <FiShoppingBag size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-2">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-transparent border-none outline-none w-full text-sm"
            />
            <FiSearch className="text-gray-500" />
          </div>
          <Link to="/" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          
          <Link to="/categories" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
          
          {user ? (
            <div className="border-t pt-4 mt-2 flex flex-col gap-4">
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark hover:text-brand-green">
                Hi, {user.name} (Profile)
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-red-500 flex items-center gap-2 text-left">
                <FiLogOut size={20} /> <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="border-t pt-4 mt-2 flex gap-6">
              <Link to="/login" className="text-gray-700 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FiUser size={20} /> <span className="text-sm font-medium">Login / Sign up</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
