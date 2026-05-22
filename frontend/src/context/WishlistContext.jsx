import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch wishlist from DB when user logs in
  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
          
          let mergedWishlist = [];
          if (data.wishlist && data.wishlist.length > 0) {
            mergedWishlist = [...data.wishlist];
          }

          // Merge local wishlist if it exists
          const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
          localWishlist.forEach(localItem => {
            const localId = localItem._id || localItem;
            const existing = mergedWishlist.find(item => (item._id || item) === localId);
            if (!existing) {
              mergedWishlist.push(localItem);
            }
          });

          setWishlist(mergedWishlist);
          setIsInitialized(true);
        } catch (error) {
          console.error("Error fetching wishlist from DB", error);
          setIsInitialized(true);
        }
      };
      fetchWishlist();
    } else {
      setIsInitialized(true);
    }
  }, [user]);

  // Sync wishlist to local storage and DB whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    if (user && isInitialized) {
      const syncToDB = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const dbWishlist = wishlist.map(item => item._id || item);
          await axios.put('http://localhost:5000/api/users/wishlist', { wishlist: dbWishlist }, config);
        } catch (error) {
          console.error("Error syncing wishlist to DB", error);
        }
      };
      syncToDB();
    }
  }, [wishlist, user, isInitialized]);

  const toggleWishlist = (product) => {
    let isAdded = false;
    setWishlist((prevWishlist) => {
      const existing = prevWishlist.find((item) => (item._id || item) === product._id);
      if (existing) {
        return prevWishlist.filter((item) => (item._id || item) !== product._id);
      } else {
        isAdded = true;
        return [...prevWishlist, product];
      }
    });

    // We can't rely on isAdded strictly inside the setWishlist callback for Swal
    // But since state updates are async, we can check if it was in the wishlist before the toggle
    const existingBeforeToggle = wishlist.find((item) => item._id === product._id);
    if (!existingBeforeToggle) {
      Swal.fire({
        title: 'Added to Wishlist!',
        text: `${product.name} has been saved.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => (item._id || item) !== id));
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => (item._id || item) === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
