import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FiArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trash Bin</h1>
            <p className="text-gray-500 text-sm mt-1">Manage deleted products</p>
          </div>
        </div>
        
        {products.length > 0 && (
          <button 
            onClick={emptyTrashHandler}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm"
          >
            <FiTrash2 /> Empty Trash
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-brand-green">Loading...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Trash is Empty</h3>
          <p className="text-gray-500">There are no deleted products to restore.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50 text-red-500 text-sm border-b border-red-100">
                  <th className="py-4 px-6 font-medium">IMAGE</th>
                  <th className="py-4 px-6 font-medium">NAME</th>
                  <th className="py-4 px-6 font-medium">CATEGORY</th>
                  <th className="py-4 px-6 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-100" />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800">{product.name}</td>
                    <td className="py-4 px-6 text-gray-600">{product.type}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => restoreHandler(product._id)}
                          className="px-3 py-1.5 bg-green-50 text-brand-green rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <FiRefreshCw size={14} /> Restore
                        </button>
                        <button 
                          onClick={() => hardDeleteHandler(product._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <FiTrash2 size={14} /> Delete
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
