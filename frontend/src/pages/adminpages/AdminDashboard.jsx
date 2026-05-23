import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FiBox, FiUsers, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import '../adminCss/AdminDashboard.css';

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
    { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: <FiDollarSign />, bgColorClass: 'admin-stat-icon-green' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: <FiShoppingBag />, bgColorClass: 'admin-stat-icon-blue' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: <FiBox />, bgColorClass: 'admin-stat-icon-orange' },
    { title: 'Total Users', value: stats.totalUsers.toString(), icon: <FiUsers />, bgColorClass: 'admin-stat-icon-purple' },
  ];

  return (
    <div>
      <h1 className="admin-dashboard-title">Dashboard Overview</h1>
      
      <div className="admin-dashboard-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="admin-stat-card">
            <div className={`admin-stat-icon-wrapper ${stat.bgColorClass}`}>
              {stat.icon}
            </div>
            <div>
              <p className="admin-stat-title">{stat.title}</p>
              <h3 className="admin-stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
