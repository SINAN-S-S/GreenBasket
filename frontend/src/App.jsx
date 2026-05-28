import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/user/Header.jsx';
import Footer from './components/user/Footer.jsx';
import SplashScreen from './components/user/SplashScreen.jsx';
import './App.css';
import Home from './pages/userpages/Home.jsx';
import Products from './pages/userpages/Products.jsx';
import ProductDetail from './pages/userpages/ProductDetail.jsx';
import Login from './pages/userpages/Login.jsx';
import Signup from './pages/userpages/Signup.jsx';
import ForgotPassword from './pages/userpages/ForgotPassword.jsx';
import ResetPassword from './pages/userpages/ResetPassword.jsx';
import Profile from './pages/userpages/Profile.jsx';
import Cart from './pages/userpages/Cart.jsx';
import Checkout from './pages/userpages/Checkout.jsx';
import OrderSuccess from './pages/userpages/OrderSuccess.jsx';
import Wishlist from './pages/userpages/Wishlist.jsx';
import About from './pages/userpages/About.jsx';
import Contact from './pages/userpages/Contact.jsx';
import AdminRoute from './components/admin/AdminRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './pages/adminpages/AdminDashboard.jsx';
import AdminProducts from './pages/adminpages/AdminProducts.jsx';
import AdminProductForm from './pages/adminpages/AdminProductForm.jsx';
import AdminProductRestore from './pages/adminpages/AdminProductRestore.jsx';
import AdminUsers from './pages/adminpages/AdminUsers.jsx';
import AdminUserRestore from './pages/adminpages/AdminUserRestore.jsx';
import AdminOrders from './pages/adminpages/AdminOrders.jsx';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AnimatePresence>
              {isLoading && <SplashScreen />}
            </AnimatePresence>

            <div className={`app-container ${isLoading ? 'app-loading' : ''}`}>
              <Header />
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:id" element={<OrderSuccess />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/restore" element={<AdminProductRestore />} />
                    <Route path="products/:id/edit" element={<AdminProductForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="users/restore" element={<AdminUserRestore />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
