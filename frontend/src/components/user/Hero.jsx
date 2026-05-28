import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { FaLeaf, FaTruck, FaStar } from 'react-icons/fa';
import { MdOutlineVerifiedUser } from "react-icons/md";
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-leaves">
        <FaLeaf className="leaf leaf-1" />
        <FaLeaf className="leaf leaf-2" />
        <FaLeaf className="leaf leaf-3" />
        <FaLeaf className="leaf leaf-4" />
        <FaLeaf className="leaf leaf-5" />
        <FaLeaf className="leaf leaf-6" />
      </div>

      <div className="hero-container">

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-text-area"
          >
            <div className="hero-badge">
              <FaLeaf className="hero-badge-icon" /> Good for You. Good for Nature.
            </div>

            <h1 className="hero-title">
              Fresh From <span className="text-green">Nature</span>,<br /> Delivered to You
            </h1>

            <p className="hero-desc">
              Discover 100% organic groceries, farm-fresh produce, and wholesome essentials for a healthier, happier you.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="hero-btn hero-btn-primary">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products" className="hero-btn hero-btn-secondary">
                Explore Products <FiArrowRight />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image-area"
          >
            <img
              src="/images/hero_groceries_composite.png"
              alt="Fresh Organic Groceries"
              className="hero-main-img"
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="floating-card floating-card-1"
            >
              <div className="floating-card-icon bg-green-light">
                <MdOutlineVerifiedUser className="text-green-dark" size={20} />
              </div>
              <div className="floating-card-text">
                <h4>100% Natural <FaLeaf className="text-green-dark" size={12} /></h4>
                <p>No chemicals. No compromise.</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="floating-card floating-card-2"
            >
              <div className="floating-card-icon bg-orange-light">
                <FaTruck className="text-orange" size={20} />
              </div>
              <div className="floating-card-text">
                <h4>Same Day Delivery <FaTruck className="text-orange" size={12} /></h4>
                <p>Freshness, delivered fast.</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="floating-card floating-card-3"
            >
              <div className="floating-card-icon bg-yellow-light">
                <FaStar className="text-yellow" size={20} />
              </div>
              <div className="floating-card-text">
                <h4>4.9/5</h4>
                <p>12K Reviews</p>
                <div className="floating-avatars">
                  <img src="https://i.pravatar.cc/100?img=1" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=2" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=3" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=4" alt="User" />
                  <div className="avatar-more">+</div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>


      </div>
    </section>
  );
};

export default Hero;
