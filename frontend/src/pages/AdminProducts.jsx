import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiFilter, FiArchive } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

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

  const categories = ['All', 'Fresh Fruits', 'Vegetables', 'Organic Products', 'Fruit Juices'];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <FiFilter className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          <Link 
            to="/admin/products/restore"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors shadow-sm font-medium"
          >
            <FiArchive /> Trash
          </Link>

          <button 
            onClick={createProductHandler}
            className="flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-xl hover:bg-brand-dark transition-colors shadow-md font-medium"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-brand-green">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">IMAGE</th>
                  <th className="py-4 px-6 font-medium">NAME</th>
                  <th className="py-4 px-6 font-medium">CATEGORY</th>
                  <th className="py-4 px-6 font-medium">STOCK</th>
                  <th className="py-4 px-6 font-medium">PRICE</th>
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
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        product.countInStock > 0 ? 'bg-green-100 text-brand-green' : 'bg-red-100 text-red-500'
                      }`}>
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-800">
                      ₹{product.price}
                      <span className="text-xs text-gray-400 block font-normal line-through">
                        {product.discount > 0 ? `₹${Math.round(product.price * (1 + product.discount/100))}` : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <Link 
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                        <button 
                          onClick={() => deleteHandler(product._id)}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
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
