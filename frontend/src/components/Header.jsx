import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cartItemCount } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="relative group cursor-pointer">
            <span className="text-gray-700 hover:text-brand-green transition-colors">Categories</span>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <ul className="py-2">
                <li><Link to="/products?category=Fresh Fruits" className="block px-4 py-2 hover:bg-brand-light text-gray-700">Fresh Fruits</Link></li>
                <li><Link to="/products?category=Vegetables" className="block px-4 py-2 hover:bg-brand-light text-gray-700">Vegetables</Link></li>
                <li><Link to="/products?category=Organic Products" className="block px-4 py-2 hover:bg-brand-light text-gray-700">Organic Products</Link></li>
              </ul>
            </div>
          </div>
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
          <button className="text-gray-700 hover:text-brand-green transition-colors hidden sm:block">
            <FiUser size={22} />
          </button>
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
          
          {/* Missing Links */}
          <Link to="/products?category=Fresh Fruits" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Category: Fresh Fruits</Link>
          <Link to="/products?category=Vegetables" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Category: Vegetables</Link>
          <Link to="#" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pages</Link>
          <Link to="#" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          
          {/* Missing Wishlist and Profile */}
          <div className="border-t pt-4 mt-2 flex gap-6">
            <button className="text-gray-700 flex items-center gap-2">
              <FiHeart size={20} /> <span className="text-sm font-medium">Wishlist</span>
            </button>
            <button className="text-gray-700 flex items-center gap-2">
              <FiUser size={20} /> <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
