import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUploadCloud } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState(0);
  const [unit, setUnit] = useState('1kg');
  const [countInStock, setCountInStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setType(data.type);
        setDescription(data.description);
        setDiscount(data.discount);
        setUnit(data.unit || '1kg');
        setCountInStock(data.countInStock || 0);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
      setImage(`http://localhost:5000${data}`);
      setUploading(false);
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Image Uploaded',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        { name, price, image, type, description, discount, unit, countInStock },
        config
      );
      
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Product Updated',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/admin/products');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error updating product', 'error');
    }
  };

  if (loading) return <div className="text-center py-10 text-brand-green">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <FiArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Side: Image Preview & Upload */}
          <div className="p-8 bg-gray-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-full max-w-sm aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 flex items-center justify-center relative group">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FiUploadCloud size={48} className="mb-2 text-gray-300" />
                  <p>No image selected</p>
                </div>
              )}
              
              {/* Overlay for hovering */}
              <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all text-white font-medium">
                Change Image
                <input type="file" className="hidden" onChange={uploadFileHandler} />
              </label>
            </div>
            
            <label className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm font-medium w-full max-w-sm text-center">
              {uploading ? 'Uploading...' : 'Upload New Image'}
              <input type="file" className="hidden" onChange={uploadFileHandler} />
            </label>
          </div>

          {/* Right Side: Form Inputs */}
          <div className="p-8">
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Fresh Fruits">Fresh Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Organic Products">Organic Products</option>
                      <option value="Fruit Juices">Fruit Juices</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight / Unit *</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. 500g, 1kg, 1L"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-green text-white py-3.5 rounded-xl hover:bg-brand-dark transition-colors font-medium shadow-sm"
              >
                <FiSave /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
