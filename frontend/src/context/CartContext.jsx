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

  // Fetch cart from DB when user logs in
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
          if (data.cart && data.cart.length > 0) {
            // Map the DB cart format ({ product: object, qty: number }) to local format ({ ...product, qty: number })
            const mappedCart = data.cart.map(item => ({
              ...item.product,
              qty: item.qty
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

  // Sync cart to local storage and DB whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (user) {
      const syncToDB = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const dbCart = cart.map(item => ({ product: item._id, qty: item.qty }));
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
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const updateQty = (id, qty) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item._id === id ? { ...item, qty } : item))
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
