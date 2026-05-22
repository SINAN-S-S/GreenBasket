
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FiRefreshCcw, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

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
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <FiArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Trash / Restore</h1>
      </div>

      {loading ? (
        <div className="text-center py-10 text-brand-green">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-medium text-gray-600">The trash is empty</h2>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">IMAGE</th>
                  <th className="py-4 px-6 font-medium">NAME</th>
                  <th className="py-4 px-6 font-medium">PRICE</th>
                  <th className="py-4 px-6 font-medium">CATEGORY</th>
                  <th className="py-4 px-6 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-100 opacity-50 grayscale" />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800 line-through">{product.name}</td>
                    <td className="py-4 px-6 text-brand-green font-bold">₹{product.price}</td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        {product.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => restoreHandler(product._id)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                          title="Restore"
                        >
                          <FiRefreshCcw /> <span className="text-sm font-medium">Restore</span>
                        </button>
                        <button 
                          onClick={() => hardDeleteHandler(product._id)}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                          title="Permanently Delete"
                        >
                          <FiTrash2 /> <span className="text-sm font-medium">Delete Permanently</span>
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
