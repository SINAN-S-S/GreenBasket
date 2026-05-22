import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FiBox, FiUsers, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch users
        const { data: users } = await axios.get('http://localhost:5000/api/users', config);
        
        // Fetch products
        const { data: products } = await axios.get('http://localhost:5000/api/products');
        
        // Fetch orders
        const { data: orders } = await axios.get('http://localhost:5000/api/orders', config);

        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        setStats({
          totalSales,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: users.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: <FiDollarSign className="text-3xl" />, bgColor: 'bg-green-50 text-green-600' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: <FiShoppingBag className="text-3xl" />, bgColor: 'bg-blue-50 text-blue-600' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: <FiBox className="text-3xl" />, bgColor: 'bg-orange-50 text-orange-600' },
    { title: 'Total Users', value: stats.totalUsers.toString(), icon: <FiUsers className="text-3xl" />, bgColor: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
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
