import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TopCategories from '../components/TopCategories';
import PromotionalBanner from '../components/PromotionalBanner';
import ProductCard from '../components/ProductCard';
import BlogSection from '../components/BlogSection';
import { productsData } from '../data/products';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = () => {
      setProducts(productsData.slice(0, 8));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />
      <Services />
      
      {/* Featured Products */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-brand-green">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <PromotionalBanner />
      <TopCategories />
      <BlogSection />
    </div>
  );
};

export default Home;
