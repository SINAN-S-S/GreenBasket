import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import "../userCss/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status after a few seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        
        {/* Contact Info (Left Side) */}
        <div className="contact-info-sidebar">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="contact-info-title"
            >
              Get in Touch
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="contact-info-desc"
            >
              Have a question about your order, our farm partners, or anything else? We'd love to hear from you.
            </motion.p>
            
            <div className="contact-info-list">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="contact-info-item"
              >
                <div className="contact-info-icon-wrapper"><FiMapPin size={20} /></div>
                <div>
                  <h4 className="contact-info-item-title">Our Location</h4>
                  <p className="contact-info-item-text">123 Green Market Street,<br />Agriculture Park, Mumbai 400001</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="contact-info-item"
              >
                <div className="contact-info-icon-wrapper"><FiPhone size={20} /></div>
                <div>
                  <h4 className="contact-info-item-title">Phone Number</h4>
                  <p className="contact-info-item-text">+91 98765 43210</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="contact-info-item"
              >
                <div className="contact-info-icon-wrapper"><FiMail size={20} /></div>
                <div>
                  <h4 className="contact-info-item-title">Email Address</h4>
                  <p className="contact-info-item-text">support@greenbasket.com</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="contact-info-footer">
            <p>Customer Support Hours:</p>
            <p className="contact-info-footer-bold">Monday - Sunday: 8:00 AM - 10:00 PM</p>
          </div>
        </div>

        {/* Contact Form (Right Side) */}
        <div className="contact-form-section">
          <h3 className="contact-form-title">Send us a Message</h3>
          
          {submitStatus === 'success' && (
            <div className="contact-alert-success">
              <FiCheckCircle />
              <p>Thank you for reaching out! We'll get back to you shortly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="name" className="contact-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="contact-input"
                placeholder="John Doe"
              />
            </div>
            
            <div className="contact-form-group">
              <label htmlFor="email" className="contact-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="contact-input"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="contact-form-group">
              <label htmlFor="message" className="contact-label">Your Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="contact-input contact-textarea"
                placeholder="How can we help you today?"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="contact-submit-btn"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">Sending...</span>
              ) : (
                <>Send Message <FiSend /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Simple inline component for the success icon (or you can import it)
const FiCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default Contact;
