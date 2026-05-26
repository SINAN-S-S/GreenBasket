import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from "../../components/user/ProductCard";
import { FiFilter } from 'react-icons/fi';
import axios from 'axios';
import "../userCss/Products.css";

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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setCategory(categoryParam || '');
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products?';

        if (category && category !== 'All') {
          url += `category=${encodeURIComponent(category)}&`;
        }

        if (searchParam) {
          url += `keyword=${encodeURIComponent(searchParam)}&`;
        }

        if (sort) {
          url += `sort=${sort}&`;
        }

        if (minPrice) {
          url += `minPrice=${minPrice}&`;
        }

        if (maxPrice) {
          url += `maxPrice=${maxPrice}&`;
        }

        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, searchParam, minPrice, maxPrice]);

  const categories = ['All', 'Fresh Fruits', 'Vegetables', 'Organic Products', 'Fruit Juices', 'Meat'];

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-title">Our Products</h1>
        <p className="products-subtitle">
          Browse our wide selection of fresh, organic, and healthy products.
        </p>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <div className="products-sidebar">
          {/* Mobile Filter Toggle */}
          <button
            className="products-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FiFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`products-filters ${showMobileFilters ? 'products-filters-shown' : 'products-filters-hidden'}`}>
            <h3 className="filter-section-title">
              <FiFilter /> Filters
            </h3>

            <div className="filter-group">
              <h4 className="filter-group-title">Categories</h4>
              <ul className="filter-list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat === 'All' ? '' : cat)}
                      className={`filter-btn ${category === cat || (cat === 'All' && !category) ? 'filter-btn-active' : 'filter-btn-inactive'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4 className="filter-group-title">Price Range (₹)</h4>
              <div className="filter-price-inputs">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="filter-input"
                />
                <span className="filter-price-separator">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div>
              <h4 className="filter-group-title">Sort By</h4>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="filter-input"
              >
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="products-content">
          <div className="products-results-bar">
            <p className="products-results-text">Showing <span className="products-results-count">{products.length}</span> results</p>
          </div>

          {loading ? (
            <div className="products-loading">Loading...</div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <h3 className="products-empty-title">No products found</h3>
              <p className="products-empty-desc">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="products-grid">
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
