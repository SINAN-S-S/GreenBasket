import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const Cart = () => {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      Swal.fire('Login Required', 'Please login to proceed to checkout!', 'info');
      navigate('/login');
      return;
    }
    
    setCheckingOut(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
        unit: item.unit || '1kg'
      }));

      await axios.post('http://localhost:5000/api/orders', {
        orderItems,
        totalPrice: cartTotal
      }, config);

      clearCart();
      Swal.fire({
        title: 'Order Placed!',
        text: 'Your order has been successfully placed. Cash on Delivery.',
        icon: 'success',
        confirmButtonColor: '#22c55e'
      });
      navigate('/products');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="bg-brand-green text-white px-8 py-3 rounded-full hover:bg-brand-dark transition-colors font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <Link to={`/product/${item._id}`}>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-brand-green transition-colors">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">{item.type}</p>
                      <p className="text-brand-green font-bold flex items-center gap-1 justify-center sm:justify-start">
                        ₹{item.price} 
                        <span className="text-xs text-gray-400 font-medium">/ {item.unit || '1kg'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-100 rounded-full">
                        <button 
                          onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-brand-green transition-colors"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-800">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          disabled={item.qty >= item.countInStock}
                          className={`w-8 h-8 flex items-center justify-center transition-colors ${
                            item.qty >= item.countInStock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-brand-green'
                          }`}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove Item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-brand-green">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium text-gray-800">₹0</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-brand-green">₹{cartTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full flex items-center justify-center gap-2 bg-brand-green text-white py-4 rounded-xl hover:bg-brand-dark transition-colors font-bold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {checkingOut ? 'Processing...' : (
                  <>Proceed to Checkout <FiArrowRight /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
