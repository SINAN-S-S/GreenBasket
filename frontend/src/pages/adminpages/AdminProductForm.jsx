import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUploadCloud } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import api from '../../api';
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
        const { data } = await api.get(`/api/products/${id}`);
        setName(data.name);

        if (data.name === 'Sample name') {
          setIsNewProduct(true);
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
        Swal.fire('Error', 'Failed to load product. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire('Invalid File', 'Only JPG, PNG, WEBP, and AVIF images are allowed.', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('File Too Large', 'Image must be under 5MB.', 'error');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Backend returns { url: 'https://res.cloudinary.com/...' }
      setImage(data.url);

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Image Uploaded to Cloudinary',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Image Upload Error:', error);

      Swal.fire(
        'Upload Failed',
        error.response?.data?.message || 'Image upload failed. Please try again.',
        'error'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Don't save if image is still uploading
    if (uploading) {
      Swal.fire('Please Wait', 'Image is still uploading...', 'info');
      return;
    }

    // Warn if no image is set
    if (!image) {
      const confirm = await Swal.fire({
        title: 'No Image',
        text: 'No product image is set. Save anyway?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save',
        cancelButtonText: 'Cancel'
      });
      if (!confirm.isConfirmed) return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.put(
        `/api/products/${id}`,
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

              <label className="admin-form-image-overlay">
                {uploading ? 'Uploading...' : 'Change Image'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={uploadFileHandler}
                  disabled={uploading}
                />
              </label>
            </div>

            <label className={`admin-form-upload-btn ${uploading ? 'disabled' : ''}`}>
              {uploading ? 'Uploading to Cloudinary...' : 'Upload New Image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={uploadFileHandler}
                disabled={uploading}
              />
            </label>

            {image && image.startsWith('https://res.cloudinary.com') && (
              <p style={{ fontSize: '0.72rem', color: '#16a34a', textAlign: 'center', marginTop: '6px' }}>
                ✓ Cloudinary URL
              </p>
            )}
          </div>

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
                    placeholder="Upload an image above, or paste a URL here"
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
                disabled={uploading}
              >
                <FiSave />
                {uploading ? 'Uploading Image...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
