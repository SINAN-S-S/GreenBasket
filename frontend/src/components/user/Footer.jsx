import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand & Info */}
          <div>
            <Link to="/" className="footer-brand-logo">
              <FiShoppingBag className="footer-brand-icon" />
              <span>Green<span className="footer-brand-accent">Basket</span></span>
            </Link>
            <p className="footer-brand-desc">
              We provide the freshest organic products directly from farms to your doorstep. Healthy living made easy.
            </p>
            <div className="footer-social-links">
              <a href="#" className="footer-social-link">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">Shop</Link></li>
              <li><Link to="#" className="footer-link">About Us</Link></li>
              <li><Link to="#" className="footer-link">Blog</Link></li>
              <li><Link to="#" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-list">
              <li><Link to="/products?category=Fresh Fruits" className="footer-link">Fresh Fruits</Link></li>
              <li><Link to="/products?category=Vegetables" className="footer-link">Vegetables</Link></li>
              <li><Link to="/products?category=Organic Products" className="footer-link">Organic Products</Link></li>
              <li><Link to="/products?category=Fruit Juices" className="footer-link">Fruit Juices</Link></li>
              <li><Link to="/products?category=Meat" className="footer-link">Fresh Meat</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <FiMapPin className="footer-contact-icon footer-contact-icon-mt" size={18} />
                <span>123 Green Market Street, Agriculture Park, Kerala 400001</span>
              </li>
              <li className="footer-contact-item footer-contact-item-center">
                <FiPhone className="footer-contact-icon" size={18} />
                <span>+91 9072003407</span>
              </li>
              <li className="footer-contact-item footer-contact-item-center">
                <FiMail className="footer-contact-icon" size={18} />
                <span>support@greenbasket.com</span>
              </li>
            </ul>
            <div>
              <h5 className="footer-newsletter-heading">Subscribe Newsletter</h5>
              <div className="footer-newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="footer-newsletter-input"
                />
                <button className="footer-newsletter-btn">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 GreenBasket. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="#" className="footer-bottom-link">Privacy Policy</Link>
            <Link to="#" className="footer-bottom-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
