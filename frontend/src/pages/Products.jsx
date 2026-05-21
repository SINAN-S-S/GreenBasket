import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiFilter } from 'react-icons/fi';
import { productsData } from '../data/products';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract query params
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [category, setCategory] = useState(categoryParam || '');
  const [sort, setSort] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      
      let filtered = [...productsData];
      
      if (category) {
        filtered = filtered.filter(p => p.type === category);
      }
      
      if (searchParam) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchParam.toLowerCase()));
      }
      
      if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      }

      setProducts(filtered);
      setLoading(false);
    };
    fetchProducts();
  }, [category, sort, searchParam]);

  const categories = ['All', 'Fresh Fruits', 'Vegetables', 'Organic Products', 'Fruit Juices'];

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      {/* Page Header */}
      <div className="bg-brand-light rounded-3xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Our Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our wide selection of fresh, organic, and healthy products.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          {/* Mobile Filter Toggle */}
          <button 
            className="md:hidden w-full bg-brand-light text-brand-dark font-bold py-3 px-4 rounded-xl mb-4 flex items-center justify-center gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FiFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24`}>
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <FiFilter /> Filters
            </h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setCategory(cat === 'All' ? '' : cat)}
                      className={`text-sm ${category === cat || (cat === 'All' && !category) ? 'text-brand-green font-bold' : 'text-gray-500 hover:text-brand-green'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Sort By</h4>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-green"
              >
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-500">Showing <span className="font-bold text-gray-800">{products.length}</span> results</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-brand-green">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
