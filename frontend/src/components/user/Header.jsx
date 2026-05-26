import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiShield } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { WishlistContext } from '../../context/WishlistContext';
import './Header.css';
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
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <FiShoppingBag className="header-logo-icon" />
          <span>Green<span className="header-logo-accent">Basket</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/" className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`header-nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`}>Products</Link>
          <Link to="/about" className={`header-nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`header-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </nav>

        <div className="header-search-wrapper">
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={handleSearchChange}
              onFocus={() => searchKeyword.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn"><FiSearch /></button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="header-suggestions">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSuggestionClick(item.name)}
                  className="header-suggestion-item"
                >
                  <img src={item.image} alt={item.name} className="header-suggestion-img" />
                  <div className="header-suggestion-info">
                    <p className="header-suggestion-name">{item.name}</p>
                    <p className="header-suggestion-type">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="header-icons">
          <Link to="/wishlist" className="header-icon-link header-icon-link-hidden">
            <FiHeart size={22} />
            {wishlist?.length > 0 && (
              <span className="header-badge">
                {wishlist.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="header-user-menu group">
              {user.isAdmin && (
                <Link to="/admin/dashboard" className="header-admin-link" title="Admin Dashboard">
                  <FiShield size={20} />
                </Link>
              )}
              <Link to="/profile" className="header-profile-link">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="header-logout-btn" title="Logout">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="header-icon-link header-icon-link-hidden" title="Login">
              <FiUser size={22} />
            </Link>
          )}

          <Link to="/cart" className="header-icon-link">
            <FiShoppingBag size={22} />
            {cartItemCount > 0 && (
              <span className="header-badge header-badge-cart">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button
            className="header-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={handleSearchChange}
              onFocus={() => searchKeyword.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="mobile-search-input"
            />
            <button type="submit" className="header-search-btn"><FiSearch /></button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="mobile-suggestions">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => { handleSuggestionClick(item.name); setIsMobileMenuOpen(false); }}
                  className="header-suggestion-item"
                >
                  <img src={item.image} alt={item.name} className="header-suggestion-img" />
                  <div className="header-suggestion-info">
                    <p className="header-suggestion-name">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className={`mobile-nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <Link to="/about" className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>


          {user ? (
            <div className="mobile-user-section">
              {user.isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-user-action mobile-admin-link">
                  <FiShield size={20} /> <span>Admin Dashboard</span>
                </Link>
              )}
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="mobile-user-action mobile-profile-link">
                Hi, {user.name} (Profile)
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="mobile-user-action mobile-logout-btn">
                <FiLogOut size={20} /> <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mobile-user-section mobile-user-section-row">
              <Link to="/login" className="mobile-user-action" onClick={() => setIsMobileMenuOpen(false)}>
                <FiUser size={20} /> <span>Login / Sign up</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
