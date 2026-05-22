import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingBag, FiHeart, FiPlus, FiMinus, FiTruck, FiShield } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, updateQty, removeFromCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-brand-green">Loading...</div>;
  }

  if (!product.name) {
    return <div className="min-h-[70vh] flex items-center justify-center text-red-500">Product not found</div>;
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 min-h-[70vh]">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors mb-8 font-medium">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Image Section */}
          <div className="relative bg-gray-50 rounded-2xl flex items-center justify-center p-8 aspect-square">
            {product.discount > 0 && (
              <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg z-10 shadow-sm">
                {product.discount}% OFF
              </div>
            )}
            <button 
              onClick={() => toggleWishlist(product)}
              className={`absolute top-6 right-6 p-3 rounded-full transition-all z-10 shadow-sm bg-white ${
                isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <FiHeart size={20} className={isInWishlist(product._id) ? 'fill-current' : ''} />
            </button>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-brand-green font-bold tracking-wider text-sm uppercase bg-brand-light w-max px-3 py-1 rounded-md">
                {product.type}
              </span>
              {product.countInStock > 0 ? (
                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">
                  In Stock: {product.countInStock}
                </span>
              ) : (
                <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-md">
                  Out of Stock
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-black text-brand-green">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  ₹{Math.round(product.price * (1 + product.discount/100))}
                </span>
              )}
              <span className="text-gray-500 mb-1 ml-2 font-medium">/ {product.unit || '1kg'}</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-brand-green">
                  <FiTruck />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Free Delivery</h4>
                  <p className="text-sm">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <FiShield />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Quality Guarantee</h4>
                  <p className="text-sm">100% fresh & organic</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {cartItem ? (
                <div className="flex items-center bg-gray-100 rounded-2xl h-14 border border-gray-200">
                  <button 
                    onClick={() => cartItem.qty === 1 ? removeFromCart(product._id) : updateQty(product._id, cartItem.qty - 1)}
                    className="w-14 h-full flex items-center justify-center text-gray-600 hover:text-brand-green transition-colors text-xl"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-800 text-lg">{cartItem.qty}</span>
                  <button 
                    onClick={() => updateQty(product._id, cartItem.qty + 1)}
                    disabled={cartItem.qty >= product.countInStock}
                    className={`w-14 h-full flex items-center justify-center transition-colors text-xl ${
                      cartItem.qty >= product.countInStock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-brand-green'
                    }`}
                  >
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 h-14 rounded-2xl transition-colors flex items-center justify-center gap-3 font-bold text-lg shadow-md ${
                    product.countInStock === 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-brand-green text-white hover:bg-brand-dark'
                  }`}
                >
                  <FiShoppingBag size={20} /> {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
