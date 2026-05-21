import React from 'react';
import { Link } from 'react-router-dom';

const TopCategories = () => {
  const categories = [
    { name: 'Orange', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=150&q=80', bgColor: 'bg-orange-100' },
    { name: 'Grapes', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=150&q=80', bgColor: 'bg-green-100' },
    { name: 'Apple', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=150&q=80', bgColor: 'bg-red-100' },
    { name: 'Broccoli', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=150&q=80', bgColor: 'bg-emerald-100' },
    { name: 'Strawberry', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=150&q=80', bgColor: 'bg-rose-100' },
    { name: 'Tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80', bgColor: 'bg-red-50' },
  ];

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Top Categories</h2>
        <Link to="/products" className="text-brand-green font-medium hover:underline flex items-center gap-1">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => (
          <Link 
            to={`/products?search=${cat.name}`} 
            key={index}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-32 h-32 rounded-full ${cat.bgColor} flex items-center justify-center mb-4 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative p-4`}>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h4 className="font-medium text-gray-700 group-hover:text-brand-green transition-colors">{cat.name}</h4>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;
