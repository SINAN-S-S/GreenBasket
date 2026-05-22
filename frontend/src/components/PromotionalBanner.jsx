import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const PromotionalBanner = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1 */}
        <div className="bg-orange-50 rounded-3xl overflow-hidden relative group">
          <img 
            src="/images/promo_juice.png" 
            alt="Fresh Juices" 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/60 to-transparent flex flex-col justify-center p-8">
            <span className="text-orange-200 font-medium mb-2">100% Natural</span>
            <h3 className="text-3xl font-bold text-white mb-4">Fresh & Healthy <br/> Organic Juice</h3>
            <Link to="/products?category=Fruit Juices" className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors w-fit text-sm">
              Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="bg-green-50 rounded-3xl overflow-hidden relative group">
          <img 
            src="/images/promo_veg.png" 
            alt="Organic Vegetables" 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-transparent flex flex-col justify-center p-8">
            <span className="text-green-200 font-medium mb-2">Weekend Sale</span>
            <h3 className="text-3xl font-bold text-white mb-4">Get 25% Off On <br/> Fresh Vegetables</h3>
            <Link to="/products?category=Vegetables" className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2 rounded-full font-medium hover:bg-brand-dark transition-colors w-fit text-sm">
              Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
