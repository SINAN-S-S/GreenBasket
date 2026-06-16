import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../../components/user/Hero';
import Services from '../../components/user/Services';
import TopCategories from '../../components/user/TopCategories';
import PromotionalBanner from '../../components/user/PromotionalBanner';
import ProductCard from '../../components/user/ProductCard';
import BlogSection from '../../components/user/BlogSection';
import Testimonials from '../../components/user/Testimonials';
import "../userCss/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      let retries = 3;
      while (retries > 0) {
        setLoading(true);
        try {
          const { data } = await axios.get('http://localhost:5000/api/products');
          setProducts(data.slice(0, 8));
          break; // Success, exit loop
        } catch (error) {
          console.error(`Error fetching products (retries left: ${retries - 1}):`, error);
          retries -= 1;
          if (retries === 0) {
            setLoading(false);
          } else {
            await new Promise(res => setTimeout(res, 1000));
          }
        }
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />
      <Services />

      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Featured Products</h2>
        </div>

        {loading ? (
          <div className="home-loading">Loading...</div>
        ) : (
          <div className="home-products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <PromotionalBanner />
      <TopCategories />
      <Testimonials />
      <BlogSection />
    </div>
  );
};

export default Home;
