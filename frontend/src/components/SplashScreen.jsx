import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex overflow-hidden">
      {/* Left Door */}
      <motion.div
        initial={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
        className="w-1/2 h-full bg-brand-green flex items-center justify-end relative shadow-2xl"
      >
        {/* Door handle left */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-white/20 rounded-full" />
      </motion.div>

      {/* Right Door */}
      <motion.div
        initial={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
        className="w-1/2 h-full bg-brand-green flex items-center justify-start relative shadow-2xl border-l border-white/10"
      >
        {/* Door handle right */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-white/20 rounded-full" />
      </motion.div>

      {/* Center Welcome Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, delay: 0.2, exit: { duration: 0.4, delay: 1 } }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      >
        <motion.div 
          animate={{ 
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-white p-6 rounded-full shadow-2xl mb-6 relative overflow-hidden group"
        >
          <FiShoppingBag size={64} className="text-brand-green" />
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md mb-2"
          >
            Welcome to <span className="text-brand-orange">GreenBasket</span>
          </motion.h1>
        </div>
        
        <div className="overflow-hidden">
          <motion.p 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-green-50 text-lg md:text-xl font-medium tracking-wide"
          >
            Opening the doors to fresh groceries...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
