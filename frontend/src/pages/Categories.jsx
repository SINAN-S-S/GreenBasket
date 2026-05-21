import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping of common categories to images and colors for a beautiful UI
  const categoryMetadata = {
    'Fresh Fruits': {
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=500&q=80',
      color: 'bg-red-50 text-red-600',
    },
    'Vegetables': {
      image: 'https://images.unsplash.com/photo-1594951169622-c423ef211ef5?auto=format&fit=crop&w=500&q=80',
      color: 'bg-emerald-50 text-emerald-600',
    },
    'Organic Products': {
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
      color: 'bg-green-50 text-brand-green',
    },
    'Fruit Juices': {
      image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8b?auto=format&fit=crop&w=500&q=80',
      color: 'bg-orange-50 text-orange-600',
    },
    'Meat': {
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80',
      color: 'bg-rose-50 text-rose-600',
    },
    // Default fallback
    'default': {
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500&q=80',
      color: 'bg-gray-50 text-gray-600',
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        // Extract unique categories from products
        const uniqueCategories = [...new Set(data.map(item => item.type))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-12 min-h-[70vh]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse by Category</h1>
        <p className="text-gray-600">
          Explore our wide range of fresh, organic, and locally sourced products curated just for you.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-green">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const meta = categoryMetadata[cat] || categoryMetadata['default'];
            return (
              <Link 
                to={`/products?category=${encodeURIComponent(cat)}`} 
                key={index}
                className="group block bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                  <img 
                    src={meta.image} 
                    alt={cat} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className={`p-6 ${meta.color} bg-opacity-50`}>
                  <h3 className="text-xl font-bold mb-1">{cat}</h3>
                  <p className="text-sm opacity-80 group-hover:underline">Shop now &rarr;</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
