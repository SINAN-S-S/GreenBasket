import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

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
    <div className="w-full py-12 px-4 md:px-8 lg:px-12 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Contact Info (Left Side) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-brand-green to-green-600 p-10 text-white flex flex-col justify-between">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold mb-4"
            >
              Get in Touch
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-green-50 mb-10"
            >
              Have a question about your order, our farm partners, or anything else? We'd love to hear from you.
            </motion.p>
            
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="bg-white/20 p-3 rounded-full"><FiMapPin size={20} /></div>
                <div>
                  <h4 className="font-semibold text-lg">Our Location</h4>
                  <p className="text-green-50 text-sm">123 Green Market Street,<br />Agriculture Park, Mumbai 400001</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="bg-white/20 p-3 rounded-full"><FiPhone size={20} /></div>
                <div>
                  <h4 className="font-semibold text-lg">Phone Number</h4>
                  <p className="text-green-50 text-sm">+91 98765 43210</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="bg-white/20 p-3 rounded-full"><FiMail size={20} /></div>
                <div>
                  <h4 className="font-semibold text-lg">Email Address</h4>
                  <p className="text-green-50 text-sm">support@greenbasket.com</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-green-100">
            <p>Customer Support Hours:</p>
            <p className="font-semibold">Monday - Sunday: 8:00 AM - 10:00 PM</p>
          </div>
        </div>

        {/* Contact Form (Right Side) */}
        <div className="w-full md:w-7/12 p-10 lg:p-16">
          <h3 className="text-2xl font-bold text-brand-dark mb-6">Send us a Message</h3>
          
          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <FiCheckCircle />
              <p>Thank you for reaching out! We'll get back to you shortly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white transition-all"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white transition-all resize-none"
                placeholder="How can we help you today?"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-brand-green to-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'
              }`}
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
