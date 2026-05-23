import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './PromotionalBanner.css';

const PromotionalBanner = () => {
  return (
    <section className="promo-section">
      <div className="promo-grid">
        {/* Banner 1 */}
        <div className="promo-banner promo-banner-orange">
          <img 
            src="/images/promo_juice.png" 
            alt="Fresh Juices" 
            className="promo-banner-img"
          />
          <div className="promo-banner-overlay promo-overlay-orange">
            <span className="promo-badge promo-badge-orange">100% Natural</span>
            <h3 className="promo-title">Fresh & Healthy <br/> Organic Juice</h3>
            <Link to="/products?category=Fruit Juices" className="promo-btn promo-btn-orange">
              Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="promo-banner promo-banner-green">
          <img 
            src="/images/promo_veg.png" 
            alt="Organic Vegetables" 
            className="promo-banner-img"
          />
          <div className="promo-banner-overlay promo-overlay-green">
            <span className="promo-badge promo-badge-green">Weekend Sale</span>
            <h3 className="promo-title">Get 25% Off On <br/> Fresh Vegetables</h3>
            <Link to="/products?category=Vegetables" className="promo-btn promo-btn-green">
              Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
