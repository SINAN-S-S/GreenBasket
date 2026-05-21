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
          className="lg:col-span-2 bg-gradient-to-r from-brand-cream to-green-50 rounded-3xl p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden h-[400px]"
        >
          <div className="relative z-10 max-w-md">
            <span className="inline-block px-4 py-1 bg-brand-green/10 text-brand-green font-semibold rounded-full text-sm mb-4">
              100% Organic Products
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark mb-4 leading-tight">
              Fresh & Healthy <br/> Organic Food
            </h1>
            <p className="text-gray-600 mb-8">
              Get the freshest organic grocery delivery to your doorstep. Healthy living starts here!
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors w-fit">
              Shop Now <FiArrowRight />
            </Link>
          </div>
          {/* Background Image decoration */}
          <div className="absolute right-0 bottom-0 w-1/2 h-full hidden sm:block">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Fresh Groceries" 
              className="object-cover h-full w-full mask-image-gradient"
              style={{ clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            />
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
              src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80" 
              alt="Oranges" 
              className="absolute -right-4 -bottom-4 w-32 h-32 object-cover rounded-full shadow-lg"
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
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80" 
              alt="Carrots" 
              className="absolute -right-4 -bottom-4 w-32 h-32 object-cover rounded-full shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
