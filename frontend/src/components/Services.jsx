import React from 'react';
import { FiTruck, FiShield, FiRefreshCcw, FiAward } from 'react-icons/fi';

const Services = () => {
  const features = [
    {
      icon: <FiTruck size={24} />,
      title: 'Free Delivery',
      subtitle: 'For all orders over ₹500',
      bgColor: 'bg-green-100',
      iconColor: 'text-brand-green',
    },
    {
      icon: <FiShield size={24} />,
      title: 'Secure Payment',
      subtitle: '100% secure payment',
      bgColor: 'bg-orange-100',
      iconColor: 'text-brand-orange',
    },
    {
      icon: <FiRefreshCcw size={24} />,
      title: '24/7 Return',
      subtitle: '30 days return policy',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      icon: <FiAward size={24} />,
      title: 'Best Quality',
      subtitle: 'Original products guaranteed',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${feature.bgColor} ${feature.iconColor}`}>
              {feature.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
