import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
          if (data.cart && data.cart.length > 0) {
            const mappedCart = data.cart.map(item => ({
              ...item.product,
              qty: item.qty,
              unit: item.unit || '1kg',
              price: item.unit === '500g' ? Math.round(item.product.price * 0.5) : (item.unit === '250g' ? Math.round(item.product.price * 0.25) : item.product.price)
            }));
            setCart(mappedCart);
          }
        } catch (error) {
          console.error("Error fetching cart from DB", error);
        }
      };
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (user) {
      const syncToDB = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const dbCart = cart.map(item => ({ product: item._id, qty: item.qty, unit: item.unit }));
          await axios.put('http://localhost:5000/api/users/cart', { cart: dbCart }, config);
        } catch (error) {
          console.error("Error syncing cart to DB", error);
        }
      };
      syncToDB();
    }
  }, [cart, user]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id && item.unit === product.unit);
      if (existing) {
        if (existing.qty >= product.countInStock) {
          return prevCart;
        }
        return prevCart.map((item) =>
          item._id === product._id && item.unit === product.unit ? { ...item, qty: item.qty + 1 } : item
        );
      }
      if (product.countInStock === 0) return prevCart;
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id, unit) => {
    setCart((prevCart) => prevCart.filter((item) => !(item._id === id && item.unit === unit)));
  };

  const updateQty = (id, unit, qty) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item._id === id && item.unit === unit ? { ...item, qty: Math.min(qty, item.countInStock || qty) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
