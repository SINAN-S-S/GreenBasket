import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiShield } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';

import axios from 'axios';

const Header = () => {
  const { cartItemCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Handle Search Input Change
  const handleSearchChange = async (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.length > 0) {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products?keyword=${keyword}`);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${searchKeyword}`);
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearchKeyword(productName);
    setShowSuggestions(false);
    navigate(`/products?search=${productName}`);
  };

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
          <Link to="/about" className="text-gray-700 hover:text-brand-green transition-colors">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-green transition-colors">Contact</Link>
        </nav>

        <div className="hidden lg:flex items-center relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-brand-green focus-within:bg-white transition-all z-20">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={handleSearchChange}
              onFocus={() => searchKeyword.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
            />
            <button type="submit"><FiSearch className="text-gray-500 hover:text-brand-green cursor-pointer" /></button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSuggestionClick(item.name)}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                >
                  <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Link to="/wishlist" className="relative text-gray-700 hover:text-brand-green transition-colors hidden sm:block">
            <FiHeart size={22} />
            {wishlist?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group cursor-pointer hidden sm:flex items-center gap-2">
              {user.isAdmin && (
                <Link to="/admin/dashboard" className="text-brand-green hover:text-brand-dark transition-colors mr-1" title="Admin Dashboard">
                  <FiShield size={20} />
                </Link>
              )}
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
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-2 relative z-20">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={handleSearchChange}
              onFocus={() => searchKeyword.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="bg-transparent border-none outline-none w-full text-sm"
            />
            <button type="submit"><FiSearch className="text-gray-500" /></button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-16 left-4 right-4 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => { handleSuggestionClick(item.name); setIsMobileMenuOpen(false); }}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                >
                  <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <Link to="/about" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>


          {user ? (
            <div className="border-t pt-4 mt-2 flex flex-col gap-4">
              {user.isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-green flex items-center gap-2 text-left">
                  <FiShield size={20} /> <span className="text-sm font-medium">Admin Dashboard</span>
                </Link>
              )}
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
