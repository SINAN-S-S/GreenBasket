import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Info */}
          <div>
            <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2 mb-6">
              <FiShoppingBag className="text-brand-green" />
              <span>Green<span className="text-brand-green">Basket</span></span>
            </Link>
            <p className="text-gray-400 mb-6">
              We provide the freshest organic products directly from farms to your doorstep. Healthy living made easy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-brand-green p-2 rounded-full transition-colors text-white">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-brand-green p-2 rounded-full transition-colors text-white">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-brand-green p-2 rounded-full transition-colors text-white">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-brand-green transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-brand-green transition-colors">Shop</Link></li>
              <li><Link to="#" className="hover:text-brand-green transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-brand-green transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-brand-green transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=Fresh Fruits" className="hover:text-brand-green transition-colors">Fresh Fruits</Link></li>
              <li><Link to="/products?category=Vegetables" className="hover:text-brand-green transition-colors">Vegetables</Link></li>
              <li><Link to="/products?category=Organic Products" className="hover:text-brand-green transition-colors">Organic Products</Link></li>
              <li><Link to="/products?category=Fruit Juices" className="hover:text-brand-green transition-colors">Fruit Juices</Link></li>
              <li><Link to="/products?category=Meat" className="hover:text-brand-green transition-colors">Fresh Meat</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 mb-6 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-brand-green mt-1" size={18} />
                <span>123 Organic Farm Road, Green City, GC 10023</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-brand-green" size={18} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-brand-green" size={18} />
                <span>support@greenbasket.com</span>
              </li>
            </ul>
            <div>
              <h5 className="text-white font-medium mb-3">Subscribe Newsletter</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-gray-800 text-white border-none outline-none px-4 py-2 rounded-l-md w-full focus:ring-1 focus:ring-brand-green"
                />
                <button className="bg-brand-green text-white px-4 py-2 rounded-r-md hover:bg-brand-dark transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; 2026 GreenBasket. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
