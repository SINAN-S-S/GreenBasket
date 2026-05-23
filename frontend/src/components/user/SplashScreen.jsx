import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-container">
      {/* Left Door */}
      <motion.div
        initial={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
        className="splash-door splash-door-left"
      >
        {/* Door handle left */}
        <div className="splash-handle splash-handle-left" />
      </motion.div>

      {/* Right Door */}
      <motion.div
        initial={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
        className="splash-door splash-door-right"
      >
        {/* Door handle right */}
        <div className="splash-handle splash-handle-right" />
      </motion.div>

      {/* Center Welcome Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, delay: 0.2, exit: { duration: 0.4, delay: 1 } }}
        className="splash-content"
      >
        <motion.div 
          animate={{ 
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 1, delay: 0.5 }}
          className="splash-icon-wrapper"
        >
          <FiShoppingBag size={64} className="splash-icon" />
        </motion.div>
        
        <div className="splash-text-wrapper">
          <motion.h1 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="splash-title"
          >
            Welcome to <span className="splash-title-accent">GreenBasket</span>
          </motion.h1>
        </div>
        
        <div className="splash-text-wrapper">
          <motion.p 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="splash-subtitle"
          >
            Opening the doors to fresh groceries...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
