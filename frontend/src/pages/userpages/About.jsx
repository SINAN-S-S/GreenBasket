import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHeart, FiTruck, FiShield } from 'react-icons/fi';
import "../userCss/About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="about-hero-title"
        >
          About <span className="about-hero-title-highlight">GreenBasket</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="about-hero-desc"
        >
          We are your trusted online marketplace for farm-fresh fruits and vegetables. 
          Bringing nature's finest produce straight to your doorstep.
        </motion.p>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="about-story-img-container"
        >
          <img 
            src="https://pin.it/65XlwBBHG" 
            alt="Fresh produce" 
            className="about-story-img"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="about-story-content"
        >
          <h2 className="about-story-title">Our Story</h2>
          <p className="about-story-text">
            GreenBasket started with a simple mission: to connect local farmers with conscious consumers. 
            We believe that everyone deserves access to fresh, healthy, and organic produce without the 
            hassle of navigating crowded supermarkets.
          </p>
          <p className="about-story-text">
            Today, we partner with dozens of organic farms to ensure that the fruits and vegetables 
            you receive are handpicked, thoroughly inspected, and delivered with the utmost care.
          </p>
          <ul className="about-story-list">
            {[
              "100% Organic & Pesticide Free",
              "Sourced Directly from Local Farmers",
              "Eco-friendly Packaging",
              "Same-day Delivery Available"
            ].map((item, idx) => (
              <li key={idx} className="about-story-list-item">
                <FiCheckCircle className="about-story-list-icon" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="about-benefits">
        <div className="about-benefits-container">
          <div className="about-benefits-header">
            <h2 className="about-benefits-title">Why Choose Us?</h2>
            <p className="about-benefits-desc">
              Experience the benefits of online vegetable shopping with our premium service and guarantees.
            </p>
          </div>
          
          <div className="about-benefits-grid">
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
                className="about-benefit-card"
              >
                <div className="about-benefit-icon-container">
                  {benefit.icon}
                </div>
                <h3 className="about-benefit-title">{benefit.title}</h3>
                <p className="about-benefit-desc">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
