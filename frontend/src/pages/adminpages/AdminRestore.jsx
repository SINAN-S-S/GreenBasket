
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FiRefreshCcw, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import '../adminCss/AdminRestore.css';

const AdminRestore = () => {
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
    const result = await Swal.fire({
      title: 'Restore Product?',
      text: "This product will be visible in the store again.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e', // brand-green
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, restore it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`http://localhost:5000/api/products/${id}/restore`, {}, config);
        Swal.fire({
          title: 'Restored!',
          text: 'The product has been restored.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchDeletedProducts();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error restoring product' });
      }
    }
  };

  const hardDeleteHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Permanently Delete?',
      text: "You won't be able to revert this! This completely erases the product from the database.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it permanently!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}/hard`, config);
        Swal.fire({
          title: 'Deleted!',
          text: 'The product has been permanently deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchDeletedProducts();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error deleting product' });
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
          <h1 className="admin-restore-title">Trash / Restore</h1>
        </div>
      </div>

      {loading ? (
        <div className="admin-restore-loading">Loading...</div>
      ) : products.length === 0 ? (
        <div className="admin-restore-empty-state">
          <h2 className="admin-restore-empty-title">The trash is empty</h2>
        </div>
      ) : (
        <div className="admin-restore-table-container">
          <div className="admin-restore-table-wrapper">
            <table className="admin-restore-table">
              <thead>
                <tr>
                  <th className="th-gray">IMAGE</th>
                  <th className="th-gray">NAME</th>
                  <th className="th-gray">PRICE</th>
                  <th className="th-gray">CATEGORY</th>
                  <th className="th-gray text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt={product.name} className="admin-restore-img" />
                    </td>
                    <td className="admin-restore-text-dark admin-restore-line-through">{product.name}</td>
                    <td className="admin-restore-price">₹{product.price}</td>
                    <td>
                      <span className="admin-restore-badge">
                        {product.type}
                      </span>
                    </td>
                    <td>
                      <div className="admin-restore-actions">
                        <button 
                          onClick={() => restoreHandler(product._id)}
                          className="admin-restore-action-btn admin-restore-action-restore"
                          title="Restore"
                        >
                          <FiRefreshCcw /> <span>Restore</span>
                        </button>
                        <button 
                          onClick={() => hardDeleteHandler(product._id)}
                          className="admin-restore-action-btn admin-restore-action-delete"
                          title="Permanently Delete"
                        >
                          <FiTrash2 /> <span>Delete Permanently</span>
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

export default AdminRestore;
