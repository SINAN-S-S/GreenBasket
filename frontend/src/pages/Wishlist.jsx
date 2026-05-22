import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { WishlistContext } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 min-h-[70vh]">
      <div className="bg-brand-light rounded-3xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Your Wishlist</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Products you've saved for later.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">You haven't liked any products yet. Explore our store to find your favorites!</p>
          <Link to="/products" className="bg-brand-green text-white px-8 py-3 rounded-full hover:bg-brand-dark transition-colors font-medium">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
