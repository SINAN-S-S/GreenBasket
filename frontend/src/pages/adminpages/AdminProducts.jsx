import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiFilter, FiArchive } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import '../adminCss/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const url = category 
        ? `http://localhost:5000/api/products?category=${encodeURIComponent(category)}`
        : 'http://localhost:5000/api/products';
      const { data } = await axios.get(url);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Move to Trash?',
      text: "This product will be hidden from the store. You can restore it later.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, trash it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        Swal.fire('Trashed!', 'Product has been moved to trash.', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error deleting product', 'error');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/products', {}, config);
      navigate(`/admin/products/${data._id}/edit`);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error creating product', 'error');
    }
  };

  const categories = ['All', 'Fresh Fruits', 'Vegetables', 'Organic Products', 'Fruit Juices', 'Meat'];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        
        <div className="admin-header-actions">
          <div className="admin-filter-wrapper">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
              className="admin-filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <FiFilter className="admin-filter-icon" />
          </div>

          <Link 
            to="/admin/products/restore"
            className="admin-btn-secondary"
          >
            <FiArchive /> Trash
          </Link>

          <button 
            onClick={createProductHandler}
            className="admin-btn-primary"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>STOCK</th>
                  <th>PRICE</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt={product.name} className="admin-table-img" />
                    </td>
                    <td className="admin-table-text-dark">{product.name}</td>
                    <td className="admin-table-text-muted">{product.type}</td>
                    <td>
                      <span className={`admin-badge ${
                        product.countInStock > 0 ? 'admin-badge-success' : 'admin-badge-danger'
                      }`}>
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="admin-table-price">
                      ₹{product.price}
                      <span className="admin-table-price-old">
                        {product.discount > 0 ? `₹${Math.round(product.price * (1 + product.discount/100))}` : ''}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link 
                          to={`/admin/products/${product._id}/edit`}
                          className="admin-action-btn admin-action-edit"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                        <button 
                          onClick={() => deleteHandler(product._id)}
                          className="admin-action-btn admin-action-delete"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
