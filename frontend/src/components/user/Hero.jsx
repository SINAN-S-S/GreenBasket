import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-grid">
        {/* Main Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-main"
        >
          {/* Full Background Image */}
          <motion.img 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            src="/images/hero_main.png" 
            alt="Fresh Groceries Background" 
            className="hero-main-bg"
          />
          
          {/* Gradient Overlay for text readability */}
          <div className="hero-main-overlay"></div>

          <div className="hero-main-content">
            <span className="hero-badge">
              100% Organic Products
            </span>
            <h1 className="hero-title">
              Fresh & Healthy <br/> Organic Food
            </h1>
            <p className="hero-desc">
              Get the freshest organic grocery delivery to your doorstep. Healthy living starts here!
            </p>
            <Link to="/products" className="hero-btn">
              Shop Now <FiArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* Side Banners */}
        <div className="hero-side-container">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-side-banner hero-side-banner-orange"
          >
            <div className="hero-side-content">
              <h3 className="hero-side-title">Summer Sale <br/> 30% Off</h3>
              <Link to="/products" className="hero-side-link hero-side-link-orange">Shop Now</Link>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80" 
              alt="Oranges" 
              className="hero-side-img"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hero-side-banner hero-side-banner-blue"
          >
            <div className="hero-side-content">
              <h3 className="hero-side-title">Fresh Veggies <br/> Big Discount</h3>
              <Link to="/products" className="hero-side-link hero-side-link-blue">Shop Now</Link>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80" 
              alt="Carrots" 
              className="hero-side-img"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
