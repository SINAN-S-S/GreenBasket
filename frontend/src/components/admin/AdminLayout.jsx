import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiUsers, FiLogOut, FiArrowLeft, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Products', path: '/admin/products', icon: <FiBox /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingBag /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
  ];

  return (
    <div className="admin-layout-container">
      {/* Mobile Top Header (only on mobile screens < 768px) */}
      <header className="admin-mobile-header">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="admin-hamburger-btn"
          aria-label="Open Navigation Menu"
        >
          <FiMenu size={22} />
        </button>
        <Link to="/" className="admin-sidebar-logo">
          GreenBasket <span className="admin-sidebar-logo-badge">Admin</span>
        </Link>
        <div className="admin-mobile-header-spacer" />
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: persistent on desktop, slide-out drawer on mobile */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'admin-sidebar-mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo" onClick={() => setIsMobileMenuOpen(false)}>
            GreenBasket <span className="admin-sidebar-logo-badge">Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="admin-drawer-close-btn"
            aria-label="Close Navigation Menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`admin-nav-item ${
                  isActive 
                    ? 'admin-nav-item-active' 
                    : 'admin-nav-item-inactive'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link 
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="admin-footer-btn admin-footer-btn-store"
          >
            <FiArrowLeft />
            Return to Store
          </Link>
          <button 
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="admin-footer-btn admin-footer-btn-logout"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
