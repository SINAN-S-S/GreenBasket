import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUploadCloud } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import '../adminCss/AdminProductForm.css';

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
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setName(data.name);
        
        // Check if it's a newly created product from the 'Add Product' button
        if (data.name === 'Sample name') {
          setIsNewProduct(true);
          // Optionally clear sample data so the form looks empty for a new product
          setName('');
          setPrice('');
          setDescription('');
          setCountInStock('');
        } else {
          setPrice(data.price);
          setDescription(data.description);
          setCountInStock(data.countInStock || 0);
        }

        setImage(data.image === '/images/sample.jpg' ? '' : data.image);
        setType(data.type === 'Sample category' ? '' : data.type);
        setDiscount(data.discount);
        setUnit(data.unit || '1kg');
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
        title: isNewProduct ? 'Product Added' : 'Product Updated',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/admin/products');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error saving product', 'error');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <Link to="/admin/products" className="admin-form-back-btn">
          <FiArrowLeft />
        </Link>
        <h1 className="admin-form-title">{isNewProduct ? 'Add Product' : 'Edit Product'}</h1>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-grid">
          
          {/* Left Side: Image Preview & Upload */}
          <div className="admin-form-image-section">
            <div className="admin-form-image-preview">
              {image ? (
                <img src={image} alt="Preview" className="admin-form-image-img" />
              ) : (
                <div className="admin-form-image-placeholder">
                  <FiUploadCloud size={48} />
                  <p>No image selected</p>
                </div>
              )}
              
              {/* Overlay for hovering */}
              <label className="admin-form-image-overlay">
                Change Image
                <input type="file" onChange={uploadFileHandler} />
              </label>
            </div>
            
            <label className="admin-form-upload-btn">
              {uploading ? 'Uploading...' : 'Upload New Image'}
              <input type="file" onChange={uploadFileHandler} />
            </label>
          </div>

          {/* Right Side: Form Inputs */}
          <div className="admin-form-inputs-section">
            <form onSubmit={submitHandler} className="admin-form">
              <div className="admin-form-fields">
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-row-3">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Price (₹) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="admin-form-input"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Stock Quantity</label>
                    <input
                      type="number"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      className="admin-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-row-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="admin-form-input admin-form-select"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Fresh Fruits">Fresh Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Organic Products">Organic Products</option>
                      <option value="Fruit Juices">Fruit Juices</option>
                      <option value="Meat">Meat</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Weight / Unit *</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. 500g, 1kg, 1L"
                      className="admin-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="admin-form-submit"
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
