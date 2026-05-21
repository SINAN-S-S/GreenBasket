import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
