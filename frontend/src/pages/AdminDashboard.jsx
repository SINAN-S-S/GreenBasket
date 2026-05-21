import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiBox, FiUsers, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProductCount(data.length);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Products', value: productCount, icon: <FiBox className="text-3xl text-brand-orange" />, bgColor: 'bg-orange-50' },
    { title: 'Total Users', value: '1', icon: <FiUsers className="text-3xl text-blue-500" />, bgColor: 'bg-blue-50' },
    { title: 'Total Revenue', value: '₹0', icon: <FiDollarSign className="text-3xl text-brand-green" />, bgColor: 'bg-green-50' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
