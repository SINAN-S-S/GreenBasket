import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import '../adminCss/AdminRestore.css';

const AdminProductRestore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchDeletedProducts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/products/deleted/all', config);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching deleted products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const restoreHandler = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/products/${id}/restore`, {}, config);
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Product Restored',
        showConfirmButton: false,
        timer: 1500
      });
      fetchDeletedProducts();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error restoring product', 'error');
    }
  };

  const hardDeleteHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Permanently Delete?',
      text: "You won't be able to revert this! This action is irreversible.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}/hard`, config);
        Swal.fire('Deleted!', 'Product has been permanently deleted.', 'success');
        fetchDeletedProducts();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error deleting product', 'error');
      }
    }
  };

  const emptyTrashHandler = async () => {
    const result = await Swal.fire({
      title: 'Empty Trash?',
      text: "This will permanently delete all products in the trash! This action is irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, empty trash!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete('http://localhost:5000/api/products/deleted/all/empty', config);
        Swal.fire('Emptied!', 'All trashed products have been permanently deleted.', 'success');
        fetchDeletedProducts();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error emptying trash', 'error');
      }
    }
  };

  return (
    <div>
      <div className="admin-restore-header">
        <div className="admin-restore-header-left">
          <Link to="/admin/products" className="admin-restore-back-btn">
            <FiArrowLeft />
          </Link>
          <div>
            <h1 className="admin-restore-title">Trash Bin</h1>
            <p className="admin-restore-subtitle">Manage deleted products</p>
          </div>
        </div>
        
        {products.length > 0 && (
          <button 
            onClick={emptyTrashHandler}
            className="admin-restore-empty-btn"
          >
            <FiTrash2 /> Empty Trash
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-restore-loading">Loading...</div>
      ) : products.length === 0 ? (
        <div className="admin-restore-empty-state">
          <div className="admin-restore-empty-icon">
            <FiTrash2 />
          </div>
          <h3 className="admin-restore-empty-title">Trash is Empty</h3>
          <p className="admin-restore-empty-desc">There are no deleted products to restore.</p>
        </div>
      ) : (
        <div className="admin-restore-table-container">
          <div className="admin-restore-table-wrapper">
            <table className="admin-restore-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt={product.name} className="admin-restore-img" />
                    </td>
                    <td className="admin-restore-text-dark">{product.name}</td>
                    <td className="admin-restore-text-muted">{product.type}</td>
                    <td>
                      <div className="admin-restore-actions">
                        <button 
                          onClick={() => restoreHandler(product._id)}
                          className="admin-restore-action-btn admin-restore-action-restore"
                          title="Restore"
                        >
                          <FiRefreshCw size={14} /> <span>Restore</span>
                        </button>
                        <button 
                          onClick={() => hardDeleteHandler(product._id)}
                          className="admin-restore-action-btn admin-restore-action-delete"
                          title="Permanently Delete"
                        >
                          <FiTrash2 size={14} /> <span>Delete</span>
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

export default AdminProductRestore;
