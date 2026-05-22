import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-3xl p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden h-[400px]"
        >
          {/* Full Background Image */}
          <motion.img 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            src="/images/hero_main.png" 
            alt="Fresh Groceries Background" 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-900/60 to-transparent z-10"></div>

          <div className="relative z-20 max-w-md">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full text-sm mb-4 border border-white/30">
              100% Organic Products
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Fresh & Healthy <br/> Organic Food
            </h1>
            <p className="text-green-50 mb-8 drop-shadow-md text-lg">
              Get the freshest organic grocery delivery to your doorstep. Healthy living starts here!
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors w-fit shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Shop Now <FiArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* Side Banners */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-orange-50 rounded-3xl p-6 relative overflow-hidden flex-1 flex flex-col justify-center h-[188px]"
          >
            <div className="relative z-10 w-2/3">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Summer Sale <br/> 30% Off</h3>
              <Link to="/products" className="text-brand-orange font-medium text-sm hover:underline">Shop Now</Link>
            </div>
            <img 
              src="/images/hero_oranges.png" 
              alt="Oranges" 
              className="absolute -right-4 -bottom-4 w-36 h-36 object-cover rounded-full drop-shadow-xl"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-blue-50 rounded-3xl p-6 relative overflow-hidden flex-1 flex flex-col justify-center h-[188px]"
          >
            <div className="relative z-10 w-2/3">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Fresh Veggies <br/> Big Discount</h3>
              <Link to="/products" className="text-blue-600 font-medium text-sm hover:underline">Shop Now</Link>
            </div>
            <img 
              src="/images/hero_veggies.png" 
              alt="Carrots" 
              className="absolute -right-4 -bottom-4 w-36 h-36 object-cover rounded-full drop-shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
