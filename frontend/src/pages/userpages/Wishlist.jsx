import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from "../../components/user/ProductCard";
import { WishlistContext } from '../../context/WishlistContext';
import "../userCss/Wishlist.css";

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <p className="wishlist-desc">
          Products you've saved for later.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
          <p className="wishlist-empty-desc">You haven't liked any products yet. Explore our store to find your favorites!</p>
          <Link to="/products" className="wishlist-empty-link">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
