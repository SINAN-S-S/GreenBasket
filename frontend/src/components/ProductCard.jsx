import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiPlus, FiMinus } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQty, removeFromCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const cartItem = cart.find(item => item._id === product._id);

  const handleAddToCart = () => {
    addToCart(product);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'Added to Cart',
      text: `${product.name} added to your cart!`,
      showConfirmButton: false,
      timer: 1500
    });
  };

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
      <button 
        onClick={() => toggleWishlist(product)}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 shadow-sm md:shadow-none ${
          isInWishlist(product._id) 
            ? 'bg-red-50 text-red-500' 
            : 'bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 md:opacity-0 opacity-100 group-hover:opacity-100'
        }`}
      >
        <FiHeart size={16} className={isInWishlist(product._id) ? 'fill-current' : ''} />
      </button>

        {/* Image */}
        <Link to={`/product/${product._id}`} className="block h-48 w-full rounded-xl mb-4 overflow-hidden bg-gray-50 flex items-center justify-center p-0 relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transform transition-transform duration-500 ${product.countInStock > 0 ? 'group-hover:scale-105' : 'opacity-70 grayscale'}`}
          />
          {product.countInStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 font-medium">{product.type}</span>
          {product.countInStock > 0 && product.countInStock <= 5 && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Only {product.countInStock} left!</span>
          )}
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-800 mb-2 truncate hover:text-brand-green transition-colors" title={product.name}>{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-brand-green">₹{product.price}</span>
            <span className="text-xs text-gray-400 ml-1 font-medium">/ {product.unit || '1kg'}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through ml-2 block">
                ₹{Math.round(product.price * (1 + product.discount/100))}
              </span>
            )}
          </div>
          {cartItem ? (
            <div className="flex items-center bg-gray-100 rounded-lg h-10 border border-gray-200">
              <button 
                onClick={() => cartItem.qty === 1 ? removeFromCart(product._id) : updateQty(product._id, cartItem.qty - 1)}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-brand-green transition-colors"
              >
                <FiMinus size={14} />
              </button>
              <span className="w-8 text-center font-bold text-gray-800 text-sm">{cartItem.qty}</span>
              <button 
                onClick={() => updateQty(product._id, cartItem.qty + 1)}
                disabled={cartItem.qty >= product.countInStock}
                className={`w-10 h-full flex items-center justify-center transition-colors ${
                  cartItem.qty >= product.countInStock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-brand-green'
                }`}
              >
                <FiPlus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                product.countInStock === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand-green text-white hover:bg-brand-dark shadow-md'
              }`}
            >
              <FiShoppingBag size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
