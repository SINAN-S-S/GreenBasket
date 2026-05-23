import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiUsers, FiSettings, FiLogOut, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Products', path: '/admin/products', icon: <FiBox /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingBag /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
  ];

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo">
            GreenBasket <span className="admin-sidebar-logo-badge">Admin</span>
          </Link>
        </div>
        
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.name}
                to={item.path}
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
            className="admin-footer-btn admin-footer-btn-store"
          >
            <FiArrowLeft />
            Return to Store
          </Link>
          <button 
            onClick={logout}
            className="admin-footer-btn admin-footer-btn-logout"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
