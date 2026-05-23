import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHeart, FiTruck, FiShield } from 'react-icons/fi';

const About = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-brand-light py-20 px-4 md:px-8 lg:px-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-brand-dark mb-6"
        >
          About <span className="text-brand-green">GreenBasket</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          We are your trusted online marketplace for farm-fresh fruits and vegetables. 
          Bringing nature's finest produce straight to your doorstep.
        </motion.p>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop" 
            alt="Fresh produce" 
            className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl font-bold text-brand-dark mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            GreenBasket started with a simple mission: to connect local farmers with conscious consumers. 
            We believe that everyone deserves access to fresh, healthy, and organic produce without the 
            hassle of navigating crowded supermarkets.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Today, we partner with dozens of organic farms to ensure that the fruits and vegetables 
            you receive are handpicked, thoroughly inspected, and delivered with the utmost care.
          </p>
          <ul className="space-y-3">
            {[
              "100% Organic & Pesticide Free",
              "Sourced Directly from Local Farmers",
              "Eco-friendly Packaging",
              "Same-day Delivery Available"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                <FiCheckCircle className="text-brand-green flex-shrink-0" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of online vegetable shopping with our premium service and guarantees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiHeart size={32} />, title: "Health First", desc: "Nutrient-rich, unadulterated food for you and your family." },
              { icon: <FiTruck size={32} />, title: "Fast Delivery", desc: "From farm to table in record time, maintaining perfect freshness." },
              { icon: <FiShield size={32} />, title: "Secure Quality", desc: "Rigorous quality checks ensure you get exactly what you pay for." }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-brand-light text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
