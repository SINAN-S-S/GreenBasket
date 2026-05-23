import React from 'react';
import { FiTruck, FiShield, FiRefreshCcw, FiAward } from 'react-icons/fi';
import './Services.css';

const Services = () => {
  const features = [
    {
      icon: <FiTruck size={24} />,
      title: 'Free Delivery',
      subtitle: 'For all orders over ₹500',
      iconClass: 'service-icon-green',
    },
    {
      icon: <FiShield size={24} />,
      title: 'Secure Payment',
      subtitle: '100% secure payment',
      iconClass: 'service-icon-orange',
    },
    {
      icon: <FiRefreshCcw size={24} />,
      title: '24/7 Return',
      subtitle: '30 days return policy',
      iconClass: 'service-icon-blue',
    },
    {
      icon: <FiAward size={24} />,
      title: 'Best Quality',
      subtitle: 'Original products guaranteed',
      iconClass: 'service-icon-yellow',
    },
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        {features.map((feature, index) => (
          <div key={index} className="service-item">
            <div className={`service-icon-wrapper ${feature.iconClass}`}>
              {feature.icon}
            </div>
            <div className="service-content">
              <h4 className="service-title">{feature.title}</h4>
              <p className="service-subtitle">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
