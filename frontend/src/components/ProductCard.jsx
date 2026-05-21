import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-100 p-4 relative group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {product.discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10 md:opacity-0 opacity-100 group-hover:opacity-100 shadow-sm md:shadow-none">
        <FiHeart size={16} />
      </button>

      {/* Image */}
      <div className="h-48 w-full rounded-xl mb-4 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <span className="text-xs text-gray-500 mb-1 font-medium">{product.type}</span>
        <h3 className="font-bold text-gray-800 mb-2 truncate" title={product.name}>{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-brand-green">₹{product.price}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ₹{Math.round(product.price * (1 + product.discount/100))}
              </span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-brand-light text-brand-green hover:bg-brand-green hover:text-white p-3 rounded-full transition-colors flex items-center justify-center shadow-sm"
            title="Add to Cart"
          >
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
