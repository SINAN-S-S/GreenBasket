import React from 'react';
import { Link } from 'react-router-dom';
import './TopCategories.css';

const TopCategories = () => {
  const categories = [
    { name: 'Orange', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=150&q=80', bgClass: 'category-bg-orange' },
    { name: 'Grapes', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=150&q=80', bgClass: 'category-bg-green' },
    { name: 'Apple', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=150&q=80', bgClass: 'category-bg-red' },
    { name: 'Broccoli', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=150&q=80', bgClass: 'category-bg-emerald' },
    { name: 'Strawberry', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=150&q=80', bgClass: 'category-bg-rose' },
    { name: 'Tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80', bgClass: 'category-bg-red-light' },
  ];

  return (
    <section className="categories-section">
      <div className="categories-header">
        <h2 className="categories-title">Top Categories</h2>
        <Link to="/products" className="categories-link-all">
          View All
        </Link>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <Link 
            to={`/products?search=${cat.name}`} 
            key={index}
            className="category-card"
          >
            <div className={`category-img-wrapper ${cat.bgClass}`}>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="category-img"
              />
            </div>
            <h4 className="category-name">{cat.name}</h4>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;
